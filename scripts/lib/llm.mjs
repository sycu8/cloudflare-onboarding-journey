/**
 * Minimal model client for the blog pipeline.
 *
 * Uses Cloudflare's AI REST API (OpenAI-compatible chat completions):
 *   POST https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions
 * Works for Workers AI models (`@cf/...`) and, through AI Gateway Unified
 * Billing, for third-party models (`openai/...`, `anthropic/...`).
 * Docs: developers.cloudflare.com/ai-gateway/usage/rest-api/ (checked 2026-11-22):
 * the token needs Account > Workers AI > Read (an AI Gateway-only token gets
 * 401), and `@cf/` models need a `cf-aig-gateway-id` header ("default" works).
 *
 * Config (GitHub Actions variables/secrets, never printed):
 *   BLOG_LLM_MODEL        required, e.g. "@cf/openai/gpt-oss-120b"
 *   BLOG_AI_API_TOKEN     preferred: token scoped to Workers AI / AI Gateway only
 *   CLOUDFLARE_API_TOKEN  fallback when BLOG_AI_API_TOKEN is unset
 *   CLOUDFLARE_ACCOUNT_ID account id
 *   BLOG_AI_GATEWAY_ID    gateway id (cf-aig-gateway-id); defaults to "default" for @cf/ models
 */

export class LlmNotConfiguredError extends Error {}

/** @param {NodeJS.ProcessEnv} env */
export function llmConfig(env = process.env) {
  const model = (env.BLOG_LLM_MODEL || '').trim();
  const token = env.BLOG_AI_API_TOKEN || env.CLOUDFLARE_API_TOKEN || '';
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || env.CF_ACCOUNT_ID_FALLBACK || '';
  const gatewayId = (env.BLOG_AI_GATEWAY_ID || '').trim() || (model.startsWith('@cf/') ? 'default' : '');
  return { model, token, accountId, gatewayId, configured: Boolean(model && token && accountId) };
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
  const headers = { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' };
  if (cfg.gatewayId) headers['cf-aig-gateway-id'] = cfg.gatewayId;
  const res = await fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/ai/v1/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: cfg.model,
      temperature: options.temperature ?? 0.2,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const codes = Array.isArray(data?.errors) ? data.errors.map((e) => e?.code).filter(Boolean).join(',') : '';
    throw new Error(`AI request failed: HTTP ${res.status}${codes ? ` codes ${codes}` : ''}`);
  }
  const content = data?.choices?.[0]?.message?.content ?? data?.result?.choices?.[0]?.message?.content ?? data?.result?.response;
  if (typeof content !== 'string' || !content.trim()) throw new Error('AI reply was empty');
  return extractJson(content);
}
