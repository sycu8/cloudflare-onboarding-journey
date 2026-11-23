/**
 * One real Workers AI call for @cf/openai/gpt-oss-120b.
 * Skips (exit 0) when the token or account id is unset.
 * Prints status, reply length, and parsed keys only — never the token or the raw reply.
 *
 *   BLOG_LLM_MODEL=@cf/openai/gpt-oss-120b \
 *   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… \
 *   node --experimental-strip-types scripts/test-llm-live.mjs
 */
import { chatJson, llmConfig } from './lib/llm.mjs';

const cfg = llmConfig(process.env);
if (!cfg.configured) {
  console.log('live gpt-oss check skipped: BLOG_LLM_MODEL, an AI token, and an account id are not all set');
  process.exit(0);
}
if (!cfg.model.startsWith('@cf/openai/gpt-oss-')) {
  console.log(`live gpt-oss check skipped: BLOG_LLM_MODEL is ${cfg.model}`);
  process.exit(0);
}

try {
  const parsed = await chatJson(
    {
      system: 'Reply with one JSON object and no other text.',
      user: 'Return {"ok":true,"model":"gpt-oss-120b"}.',
    },
    { env: process.env, temperature: 0 },
  );
  const keys = parsed && typeof parsed === 'object' ? Object.keys(parsed).sort() : [];
  const length = JSON.stringify(parsed ?? '').length;
  if (!length) throw new Error('AI reply was empty');
  console.log(`live gpt-oss check ok model=${cfg.model} bytes=${length} keys=${keys.join(',') || '(none)'} ok=${parsed?.ok === true}`);
} catch (error) {
  const message = error instanceof Error ? error.message : 'AI request failed';
  console.error(`live gpt-oss check failed: ${message}`);
  process.exit(1);
}
