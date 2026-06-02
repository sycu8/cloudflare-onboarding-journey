import { verifyAdminKey } from '../../src/lib/server/adminAuth';
import { jsonResponse, readJson } from '../../src/lib/server/json';
import { randomId } from '../../src/lib/server/crypto';
import { rateLimitOrThrow, rateLimitedResponse } from '../../src/lib/server/rateLimit';
import { workshopEventCreateSchema } from '../../src/lib/validation/schemas';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  WORKSHOP_ADMIN_KEY?: string;
  RATE_LIMIT_SALT?: string;
};

type EventRow = {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string | null;
  description_en: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  format: string;
  location_vi: string | null;
  location_en: string | null;
  meeting_url: string | null;
  capacity: number | null;
  primary_interest: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function mapEvent(row: EventRow) {
  return {
    id: row.id,
    title: { vi: row.title_vi, en: row.title_en },
    description: {
      vi: row.description_vi || '',
      en: row.description_en || '',
    },
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.timezone,
    format: row.format,
    location: row.location_vi || row.location_en ? { vi: row.location_vi || '', en: row.location_en || '' } : null,
    meetingUrl: row.meeting_url,
    capacity: row.capacity,
    primaryInterest: row.primary_interest,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const isAdmin = verifyAdminKey(request, env.WORKSHOP_ADMIN_KEY);
  const now = new Date().toISOString();

  if (!env.DB) {
    return jsonResponse(
      { ok: true, events: [], dbReady: false, admin: isAdmin },
      { headers: { 'cache-control': 'public, max-age=60' } },
    );
  }

  try {
    let rows: EventRow[];
    if (isAdmin) {
      const result = await env.DB.prepare(
        `SELECT * FROM workshop_events ORDER BY starts_at DESC LIMIT 50`,
      ).all<EventRow>();
      rows = result.results ?? [];
    } else {
      const result = await env.DB.prepare(
        `SELECT * FROM workshop_events
         WHERE status = 'published' AND starts_at >= ?
         ORDER BY starts_at ASC
         LIMIT 20`,
      )
        .bind(now)
        .all<EventRow>();
      rows = result.results ?? [];
    }

    return jsonResponse(
      { ok: true, events: rows.map(mapEvent), admin: isAdmin },
      { headers: { 'cache-control': isAdmin ? 'private, no-store' : 'public, max-age=60' } },
    );
  } catch (e) {
    console.error('workshop-events list error', e);
    if (!isAdmin) {
      return jsonResponse(
        { ok: true, events: [], dbReady: false, admin: false },
        { headers: { 'cache-control': 'public, max-age=30' } },
      );
    }
    return jsonResponse({ ok: false, error: 'server_error' }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const lang = (request.headers.get('x-cfhub-lang') === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  if (!verifyAdminKey(request, env.WORKSHOP_ADMIN_KEY)) {
    return jsonResponse(
      {
        ok: false,
        error: 'unauthorized',
        message: lang === 'en' ? 'Invalid admin key.' : 'Khóa admin không hợp lệ.',
      },
      { status: 401 },
    );
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

  const id = randomId('evt');
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO workshop_events (
        id, title_vi, title_en, description_vi, description_en,
        starts_at, ends_at, timezone, format, location_vi, location_en,
        meeting_url, capacity, primary_interest, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        data.titleVi,
        data.titleEn,
        data.descriptionVi || null,
        data.descriptionEn || null,
        data.startsAt,
        data.endsAt || null,
        data.timezone,
        data.format,
        data.locationVi || null,
        data.locationEn || null,
        data.meetingUrl || null,
        data.capacity ?? null,
        data.primaryInterest ?? null,
        data.status,
        now,
        now,
      )
      .run();
  } catch (e) {
    console.error('workshop-events create error', e);
    return jsonResponse(
      { ok: false, error: 'server_error', message: lang === 'en' ? 'Server error.' : 'Lỗi hệ thống.' },
      { status: 500 },
    );
  }

  const row = await env.DB.prepare(`SELECT * FROM workshop_events WHERE id = ?`).bind(id).first<EventRow>();

  return jsonResponse({ ok: true, event: row ? mapEvent(row) : { id } }, { status: 201 });
};
