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
 * JSON mode (`response_format` json_schema) is not sent for gpt-oss. The
 * supported-model list does not include it, and an unsupported request can
 * fail with "JSON Mode couldn't be met":
 *   https://developers.cloudflare.com/workers-ai/features/json-mode/
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

const STRICT_JSON_SUFFIX =
  '\n\nYour previous reply was not strict JSON. Return one JSON object only. Use double-quoted keys and strings. No markdown fences, comments, trailing commas, or prose before the opening brace.';

/**
 * @param {string} text
 * @param {number} open
 */
function matchBrace(text, open) {
  let depth = 0;
  let quote = '';
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') {
        i += 1;
        continue;
      }
      if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** @param {string} span */
function candidateScore(span) {
  let score = 0;
  if (/"post"|'post'|\bpost\s*:/.test(span)) score += 4;
  if (/"claims"|'claims'|\bclaims\s*:/.test(span)) score += 2;
  return score;
}

/**
 * Balanced `{...}` spans, longest / most post-shaped first.
 * Ignores a leading `{vi,en}`-style brace when a real object follows.
 * @param {string} text
 */
function jsonObjectCandidates(text) {
  let body = String(text || '').replace(/^\uFEFF/, '').trim();
  body = body.replace(/```(?:json)?\s*([\s\S]*?)```/gi, '$1');
  /** @type {string[]} */
  const spans = [];
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== '{') continue;
    const end = matchBrace(body, i);
    if (end > i) spans.push(body.slice(i, end + 1));
  }
  spans.sort((a, b) => candidateScore(b) - candidateScore(a) || b.length - a.length);
  return spans;
}

/** @param {string} input */
function stripJsonComments(input) {
  let out = '';
  let quote = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = input[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') {
        out += input[i + 1] || '';
        i += 1;
        continue;
      }
      if (c === quote) quote = '';
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      continue;
    }
    if (c === '/' && next === '/') {
      while (i < input.length && input[i] !== '\n') i += 1;
      out += '\n';
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i += 1;
      i += 1;
      continue;
    }
    out += c;
  }
  return out;
}

/**
 * jsonrepair-style: comments, trailing commas, single quotes, unquoted keys.
 * @param {string} input
 */
export function repairLooseJson(input) {
  const src = stripJsonComments(input).replace(/,\s*([}\]])/g, '$1');
  let out = '';
  let quote = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') {
        out += c + (src[i + 1] || '');
        i += 1;
        continue;
      }
      if (c === quote) {
        out += '"';
        quote = '';
        continue;
      }
      out += quote === "'" && c === '"' ? '\\"' : c;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += '"';
      continue;
    }
    if (c === '{' || c === ',') {
      out += c;
      const match = src.slice(i + 1).match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*):/);
      if (match) {
        out += `${match[1]}"${match[2]}"${match[3]}:`;
        i += match[0].length;
      }
      continue;
    }
    out += c;
  }
  return out;
}

/**
 * Pull a JSON object out of a model reply.
 * Handles fences, prose, `{vi,en}` field notes before the object, single quotes,
 * unquoted keys, comments, and trailing commas. Run 45169044652 failed in
 * JSON.parse at position 1 column 2, which is what `{vi,en}`, `{post:1}`, and
 * `{'post':1}` all throw when the first `{` is taken as the object.
 * @param {string} text
 */
export function extractJson(text) {
  const candidates = jsonObjectCandidates(text);
  if (!candidates.length) throw new Error('model reply has no JSON object');
  /** @type {unknown} */
  let lastError = null;
  for (const candidate of candidates) {
    for (const variant of [candidate, repairLooseJson(candidate)]) {
      try {
        return JSON.parse(variant);
      } catch (error) {
        lastError = error;
      }
    }
  }
  if (lastError instanceof Error) throw lastError;
  throw new Error('model reply has no JSON object');
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
 * Output text wins. Reasoning text is never used as the answer. A
 * reasoning-only body is reported so the caller can retry, then fail closed.
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
  /** @type {Error | null} */
  let parseError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const callPrompt = attempt === 0 ? prompt : { ...prompt, user: `${prompt.user}${STRICT_JSON_SUFFIX}` };
    const body = oss
      ? gptOssRequestBody({ model: cfg.model, temperature }, callPrompt, attempt)
      : {
          model: cfg.model,
          temperature,
          messages: [
            { role: 'system', content: callPrompt.system },
            { role: 'user', content: callPrompt.user },
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
    if (!last.text) continue;
    try {
      return extractJson(last.text);
    } catch (error) {
      parseError = error instanceof Error ? error : new Error('model reply has no JSON object');
    }
  }
  if (parseError) {
    const prefix = last.text.slice(0, 48).replace(/\s+/g, ' ');
    throw new Error(`${parseError.message} (reply prefix ${JSON.stringify(prefix)})`);
  }
  throw new Error(last.reasoningOnly ? 'AI reply was reasoning only' : 'AI reply was empty');
}
