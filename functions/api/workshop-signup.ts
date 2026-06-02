import { jsonResponse, readJson } from '../../src/lib/server/json';
import { hashIp, hashUserAgent, randomId } from '../../src/lib/server/crypto';
import { rateLimitOrThrow, rateLimitedResponse } from '../../src/lib/server/rateLimit';
import { verifyTurnstile } from '../../src/lib/server/turnstile';
import { workshopSignupSchema } from '../../src/lib/validation/schemas';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
};

function validationError(lang: 'vi' | 'en') {
  return jsonResponse(
    {
      ok: false,
      error: 'validation_error',
      message: lang === 'en' ? 'Invalid input.' : 'Dữ liệu không hợp lệ.',
    },
    { status: 400 },
  );
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const lang = (request.headers.get('x-cfhub-lang') === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  let payload: unknown;
  try {
    payload = await readJson(request, 60_000);
  } catch {
    return validationError(lang);
  }

  const parsed = workshopSignupSchema.safeParse(payload);
  if (!parsed.success) return validationError(lang);

  const ip = request.headers.get('CF-Connecting-IP');
  const ua = request.headers.get('User-Agent');
  const salt = env.RATE_LIMIT_SALT || 'cfhub_v1';

  const ipHash = await hashIp(ip, salt);
  const uaHash = await hashUserAgent(ua, salt);

  // Rate limit (KV). Key is endpoint + ipHash + 10min bucket.
  const bucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const rlKey = `rl:workshop:${ipHash || 'noip'}:${bucket}`;
  const rl = await rateLimitOrThrow({
    kv: env.SITE_CONFIG,
    key: rlKey,
    windowSeconds: 10 * 60,
    max: 5,
  });
  if (!rl.allowed) return rateLimitedResponse(parsed.data.language);

  // Verify Turnstile
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
        message: parsed.data.language === 'en' ? 'Turnstile verification failed.' : 'Xác minh Turnstile thất bại.',
      },
      { status: 400 },
    );
  }

  let eventId: string | null = parsed.data.eventId || null;
  if (eventId) {
    const event = await env.DB.prepare(
      `SELECT id, status, starts_at FROM workshop_events WHERE id = ?`,
    )
      .bind(eventId)
      .first<{ id: string; status: string; starts_at: string }>();

    if (!event || event.status !== 'published') {
      return jsonResponse(
        {
          ok: false,
          error: 'invalid_event',
          message:
            parsed.data.language === 'en'
              ? 'This workshop event is not available for registration.'
              : 'Sự kiện workshop này không còn mở đăng ký.',
        },
        { status: 400 },
      );
    }

    if (new Date(event.starts_at).getTime() < Date.now()) {
      return jsonResponse(
        {
          ok: false,
          error: 'event_started',
          message:
            parsed.data.language === 'en'
              ? 'Registration for this event has closed.'
              : 'Sự kiện đã bắt đầu — không thể đăng ký thêm.',
        },
        { status: 400 },
      );
    }
  }

  // Duplicate email guard: 1 signup per email per 12h (best-effort, not transactional)
  const dupKey = `workshop:email:${parsed.data.email.toLowerCase()}`;
  if (env.SITE_CONFIG) {
    const existing = await env.SITE_CONFIG.get(dupKey);
    if (existing) {
      return jsonResponse(
        {
          ok: false,
          error: 'rate_limited',
          message:
            parsed.data.language === 'en'
              ? 'You have already registered recently. Please try again later.'
              : 'Email này đã đăng ký gần đây. Vui lòng thử lại sau.',
        },
        { status: 429 },
      );
    }
    await env.SITE_CONFIG.put(dupKey, '1', { expirationTtl: 12 * 60 * 60 });
  }

  const id = randomId('ws');
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO workshop_signups (
        id, name, email, company, role, primary_interest, question, language,
        source_path, utm_source, utm_medium, utm_campaign, created_at, ip_hash, user_agent_hash, event_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        parsed.data.name,
        parsed.data.email,
        parsed.data.company || null,
        parsed.data.role || null,
        parsed.data.primaryInterest,
        parsed.data.question || null,
        parsed.data.language,
        parsed.data.sourcePath || null,
        parsed.data.utm_source || null,
        parsed.data.utm_medium || null,
        parsed.data.utm_campaign || null,
        createdAt,
        ipHash,
        uaHash,
        eventId,
      )
      .run();
  } catch (e) {
    console.error('workshop-signup db error', e);
    return jsonResponse(
      {
        ok: false,
        error: 'server_error',
        message: parsed.data.language === 'en' ? 'Server error.' : 'Lỗi hệ thống.',
      },
      { status: 500 },
    );
  }

  return jsonResponse({ ok: true, message: 'registered', id }, { status: 200 });
};

