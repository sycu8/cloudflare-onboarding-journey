/**
 * Model client for the blog pipeline.
 *
 * `@cf/openai/gpt-oss-*` uses the Workers AI Responses API (non-streaming).
 * Chat completions left `choices[0].message.content` empty on run 45167164723:
 * the run schema's `max_tokens` default is 256, and the default reasoning
 * effort is medium, so a reasoning model can spend the whole budget before
 * it writes an answer. Docs (checked 2026-11-23):
 *   https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/
 *   https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/
 *   https://developers.cloudflare.com/changelog/post/2025-08-05-openai-open-models/
 * Other models stay on the OpenAI-compatible chat completions route, including
 * AI Gateway Unified Billing ids (`openai/…`, `anthropic/…`):
 *   https://developers.cloudflare.com/ai-gateway/usage/rest-api/
 * The token needs Account > Workers AI > Read. `@cf/` models send
 * `cf-aig-gateway-id` (default `default`).
 *
 * Config (GitHub Actions variables/secrets, never printed):
 *   BLOG_LLM_MODEL        required, e.g. "@cf/openai/gpt-oss-120b"
 *   BLOG_AI_API_TOKEN     preferred: token scoped to Workers AI / AI Gateway only
 *   CLOUDFLARE_API_TOKEN  fallback when BLOG_AI_API_TOKEN is unset
 *   CLOUDFLARE_ACCOUNT_ID account id
 *   BLOG_AI_GATEWAY_ID    gateway id (cf-aig-gateway-id); defaults to "default" for @cf/ models
 */

export class LlmNotConfiguredError extends Error {}

/** First attempt leaves room for a full post JSON; the retry doubles it. */
const GPT_OSS_MAX_OUTPUT_TOKENS = 8192;
const GPT_OSS_MAX_OUTPUT_TOKENS_RETRY = 16384;
/** Documented levels are low | medium (default) | high. Low keeps the answer from being crowded out. */
const GPT_OSS_REASONING_EFFORT = 'low';
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);

/** @param {NodeJS.ProcessEnv} env */
export function llmConfig(env = process.env) {
  const model = (env.BLOG_LLM_MODEL || '').trim();
  const token = env.BLOG_AI_API_TOKEN || env.CLOUDFLARE_API_TOKEN || '';
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || env.CF_ACCOUNT_ID_FALLBACK || '';
  const gatewayId = (env.BLOG_AI_GATEWAY_ID || '').trim() || (model.startsWith('@cf/') ? 'default' : '');
  return { model, token, accountId, gatewayId, configured: Boolean(model && token && accountId) };
}

/** @param {string} model */
export function isGptOssModel(model) {
  return /^@cf\/openai\/gpt-oss-/.test(model || '');
}

/**
 * Pull the first JSON object out of a model reply (handles ```json fences).
 * @param {string} text
 */
export function extractJson(text) {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : raw;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('model reply has no JSON object');
  return JSON.parse(body.slice(start, end + 1));
}

/** @param {unknown} value */
function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value : '';
}

/**
 * @param {unknown} content
 * @param {{ output: string[], reasoning: string[] }} bucket
 * @param {boolean} forceReasoning
 */
function collectParts(content, bucket, forceReasoning) {
  if (typeof content === 'string') {
    const text = nonEmpty(content);
    if (text) (forceReasoning ? bucket.reasoning : bucket.output).push(text);
    return;
  }
  if (!Array.isArray(content)) return;
  for (const part of content) {
    if (typeof part === 'string') {
      const text = nonEmpty(part);
      if (text) (forceReasoning ? bucket.reasoning : bucket.output).push(text);
      continue;
    }
    if (!part || typeof part !== 'object') continue;
    const type = String(part.type || '');
    const text = nonEmpty(part.text) || nonEmpty(part.output_text);
    if (!text) continue;
    const reasoning = forceReasoning || type === 'reasoning' || type === 'reasoning_text' || type === 'thinking';
    (reasoning ? bucket.reasoning : bucket.output).push(text);
  }
}

/**
 * Read a Workers AI / Responses / chat-completions body.
 * Output text wins. A reasoning-only body is reported separately so the
 * caller can retry with a larger budget before accepting that channel.
 * Kept chat fallbacks: choices[0].message.content, result.choices[0].message.content, result.response.
 * @param {any} data
 * @returns {{ text: string, reasoningOnly: boolean, reasoningText: string }}
 */
export function extractAssistantText(data) {
  const bucket = { output: [], reasoning: [] };
  let aggregate = '';
  const nodes = [data, data?.result].filter((node) => node && typeof node === 'object');
  for (const node of nodes) {
    if (!aggregate) aggregate = nonEmpty(node.output_text);
    if (Array.isArray(node.output)) {
      for (const item of node.output) {
        if (!item || typeof item !== 'object') continue;
        collectParts(item.content, bucket, item.type === 'reasoning');
        if (item.type !== 'reasoning') {
          const direct = nonEmpty(item.text);
          if (direct) bucket.output.push(direct);
        }
      }
    }
    const message = node.choices?.[0]?.message;
    if (message && typeof message === 'object') {
      collectParts(message.content, bucket, false);
      const reasoning = nonEmpty(message.reasoning) || nonEmpty(message.reasoning_content);
      if (reasoning) bucket.reasoning.push(reasoning);
    }
    const response = nonEmpty(node.response);
    if (response) bucket.output.push(response);
  }
  // output_text is the documented aggregate. Without it, join output_text parts.
  const text = aggregate || bucket.output.join('');
  const reasoningText = bucket.reasoning.join('\n').trim();
  return { text, reasoningOnly: !text && Boolean(reasoningText), reasoningText };
}

/**
 * @param {{ model: string, temperature?: number }} cfg
 * @param {{ system: string, user: string }} prompt
 * @param {number} attempt
 */
export function gptOssRequestBody(cfg, prompt, attempt) {
  return {
    model: cfg.model,
    stream: false,
    temperature: cfg.temperature,
    reasoning: { effort: GPT_OSS_REASONING_EFFORT },
    max_output_tokens: attempt > 0 ? GPT_OSS_MAX_OUTPUT_TOKENS_RETRY : GPT_OSS_MAX_OUTPUT_TOKENS,
    input: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
  };
}

/**
 * @param {{ system: string, user: string }} prompt
 * @param {{ env?: NodeJS.ProcessEnv, fetchImpl?: typeof fetch, temperature?: number }} [options]
 * @returns {Promise<unknown>} parsed JSON object from the model
 */
export async function chatJson(prompt, options = {}) {
  const cfg = llmConfig(options.env || process.env);
  if (!cfg.configured) {
    throw new LlmNotConfiguredError('BLOG_LLM_MODEL, an AI API token and CLOUDFLARE_ACCOUNT_ID are required');
  }
  const fetchImpl = options.fetchImpl || fetch;
  const oss = isGptOssModel(cfg.model);
  const temperature = options.temperature ?? 0.2;
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/ai/v1/${oss ? 'responses' : 'chat/completions'}`;
  const headers = { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' };
  if (cfg.gatewayId) headers['cf-aig-gateway-id'] = cfg.gatewayId;

  let last = { text: '', reasoningOnly: false, reasoningText: '' };
  for (let attempt = 0; attempt < 2; attempt++) {
    const body = oss
      ? gptOssRequestBody({ model: cfg.model, temperature }, prompt, attempt)
      : {
          model: cfg.model,
          temperature,
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user },
          ],
        };
    const res = await fetchImpl(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const codes = Array.isArray(data?.errors) ? data.errors.map((e) => e?.code).filter(Boolean).join(',') : '';
      if (attempt === 0 && RETRY_STATUSES.has(res.status)) continue;
      throw new Error(`AI request failed: HTTP ${res.status}${codes ? ` codes ${codes}` : ''}`);
    }
    last = extractAssistantText(data);
    if (last.text) return extractJson(last.text);
  }
  if (last.reasoningOnly && last.reasoningText) return extractJson(last.reasoningText);
  throw new Error(last.reasoningOnly ? 'AI reply was reasoning only' : 'AI reply was empty');
}
