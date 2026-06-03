import { verifyWorkshopAdmin, workshopAdminEmail } from '../../../src/lib/server/adminAuth';
import { jsonResponse, readJson } from '../../../src/lib/server/json';
import { rateLimitOrThrow, rateLimitedResponse } from '../../../src/lib/server/rateLimit';
import { createWorkshopEvent, listAdminEvents, mapEvent } from '../../../src/lib/server/workshopEvents';
import { workshopEventCreateSchema } from '../../../src/lib/validation/schemas';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  WORKSHOP_ADMIN_KEY?: string;
  WORKSHOP_ADMIN_EMAILS?: string;
  RATE_LIMIT_SALT?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_API_TOKEN?: string;
  WORKSHOP_EMAIL_FROM?: string;
  PUBLIC_SITE_URL?: string;
};

function unauthorized(lang: 'vi' | 'en') {
  return jsonResponse(
    {
      ok: false,
      error: 'unauthorized',
      message: lang === 'en' ? 'Admin access required.' : 'Cần quyền admin.',
    },
    { status: 401 },
  );
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const lang = (request.headers.get('x-cfhub-lang') === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  if (!verifyWorkshopAdmin(request, env)) {
    return unauthorized(lang);
  }

  if (!env.DB) {
    return jsonResponse(
      { ok: true, events: [], dbReady: false, admin: true, email: workshopAdminEmail(request) },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  }

  try {
    const rows = await listAdminEvents(env.DB);
    return jsonResponse(
      {
        ok: true,
        events: rows.map(mapEvent),
        admin: true,
        email: workshopAdminEmail(request),
      },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  } catch (e) {
    console.error('workshop-admin events list error', e);
    return jsonResponse({ ok: false, error: 'server_error' }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const lang = (request.headers.get('x-cfhub-lang') === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  if (!verifyWorkshopAdmin(request, env)) {
    return unauthorized(lang);
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const salt = env.RATE_LIMIT_SALT || 'cfhub_v1';
  const bucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const rlKey = `rl:workshop-admin:${ip || 'noip'}:${bucket}`;
  const rl = await rateLimitOrThrow({
    kv: env.SITE_CONFIG,
    key: rlKey,
    windowSeconds: 10 * 60,
    max: 30,
  });
  if (!rl.allowed) return rateLimitedResponse(lang);

  let payload: unknown;
  try {
    payload = await readJson(request, 80_000);
  } catch {
    return jsonResponse(
      { ok: false, error: 'validation_error', message: lang === 'en' ? 'Invalid input.' : 'Dữ liệu không hợp lệ.' },
      { status: 400 },
    );
  }

  const parsed = workshopEventCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: 'validation_error', message: lang === 'en' ? 'Invalid input.' : 'Dữ liệu không hợp lệ.' },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const starts = new Date(data.startsAt);
  const ends = data.endsAt ? new Date(data.endsAt) : null;
  if (ends && ends <= starts) {
    return jsonResponse(
      {
        ok: false,
        error: 'validation_error',
        message: lang === 'en' ? 'End time must be after start time.' : 'Thời gian kết thúc phải sau thời gian bắt đầu.',
      },
      { status: 400 },
    );
  }

  try {
    const event = await createWorkshopEvent(env, data, waitUntil);
    return jsonResponse({ ok: true, event }, { status: 201 });
  } catch (e) {
    console.error('workshop-admin events create error', e);
    return jsonResponse(
      { ok: false, error: 'server_error', message: lang === 'en' ? 'Server error.' : 'Lỗi hệ thống.' },
      { status: 500 },
    );
  }
};
