import { jsonResponse, readJson } from '../../src/lib/server/json';
import { hashIp, hashUserAgent, randomId } from '../../src/lib/server/crypto';
import { rateLimitOrThrow, rateLimitedResponse } from '../../src/lib/server/rateLimit';
import { verifyTurnstile } from '../../src/lib/server/turnstile';
import { feedbackSchema } from '../../src/lib/validation/schemas';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: unknown;
  try {
    payload = await readJson(request, 50_000);
  } catch {
    return jsonResponse({ ok: false, error: 'validation_error' }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: 'validation_error' }, { status: 400 });
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const ua = request.headers.get('User-Agent');
  const salt = env.RATE_LIMIT_SALT || 'cfhub_v1';
  const ipHash = await hashIp(ip, salt);
  const uaHash = await hashUserAgent(ua, salt);

  const bucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const rlKey = `rl:fb:${ipHash || 'noip'}:${bucket}`;
  const rl = await rateLimitOrThrow({
    kv: env.SITE_CONFIG,
    key: rlKey,
    windowSeconds: 10 * 60,
    max: 10,
  });
  if (!rl.allowed) return rateLimitedResponse(parsed.data.language);

  // Optional: verify Turnstile if token provided (recommended in prod)
  if (parsed.data.turnstileToken) {
    const turnstile = await verifyTurnstile({
      secret: env.TURNSTILE_SECRET_KEY,
      token: parsed.data.turnstileToken,
      ip,
    });
    if (!turnstile.ok) {
      return jsonResponse(
        {
          ok: false,
          error: 'turnstile_failed',
          message:
            parsed.data.language === 'en'
              ? 'Turnstile verification failed.'
              : 'Xác minh Turnstile thất bại.',
        },
        { status: 400 },
      );
    }
  }

  const id = randomId('fb');
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO feedback_messages (
        id, name, email, message, page_path, language, created_at, ip_hash, user_agent_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        parsed.data.name || null,
        parsed.data.email || null,
        parsed.data.message,
        parsed.data.pagePath || null,
        parsed.data.language,
        createdAt,
        ipHash,
        uaHash,
      )
      .run();
  } catch (e) {
    console.error('feedback db error', e);
    return jsonResponse({ ok: false, error: 'server_error' }, { status: 500 });
  }

  return jsonResponse({ ok: true }, { status: 200 });
};

