import { verifyWorkshopAdmin } from '../../../src/lib/server/adminAuth';
import { jsonResponse } from '../../../src/lib/server/json';
import { rateLimitOrThrow, rateLimitedResponse } from '../../../src/lib/server/rateLimit';

type Env = {
  DB: D1Database;
  SITE_CONFIG?: KVNamespace;
  WORKSHOP_ADMIN_KEY?: string;
  WORKSHOP_ADMIN_EMAILS?: string;
  RATE_LIMIT_SALT?: string;
};

type SignupRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  primary_interest: string;
  question: string | null;
  language: string;
  source_path: string | null;
  event_id: string | null;
  created_at: string;
  title_vi: string | null;
  title_en: string | null;
};

function mapSignup(row: SignupRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    jobTitle: row.role,
    primaryInterest: row.primary_interest,
    question: row.question,
    language: row.language,
    sourcePath: row.source_path,
    eventId: row.event_id,
    eventTitle: row.title_vi || row.title_en ? { vi: row.title_vi || '', en: row.title_en || '' } : null,
    createdAt: row.created_at,
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const lang = (request.headers.get('x-cfhub-lang') === 'en' ? 'en' : 'vi') as 'vi' | 'en';

  if (!verifyWorkshopAdmin(request, env)) {
    return jsonResponse(
      {
        ok: false,
        error: 'unauthorized',
        message: lang === 'en' ? 'Admin access required.' : 'Cần quyền admin.',
      },
      { status: 401 },
    );
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const bucket = Math.floor(Date.now() / (10 * 60 * 1000));
  const rlKey = `rl:workshop-admin-signups:${ip || 'noip'}:${bucket}`;
  const rl = await rateLimitOrThrow({
    kv: env.SITE_CONFIG,
    key: rlKey,
    windowSeconds: 10 * 60,
    max: 60,
  });
  if (!rl.allowed) return rateLimitedResponse(lang);

  const url = new URL(request.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') || '100') || 100));
  const offset = Math.max(0, Number(url.searchParams.get('offset') || '0') || 0);

  if (!env.DB) {
    return jsonResponse({ ok: true, signups: [], total: 0, dbReady: false }, { headers: { 'cache-control': 'private, no-store' } });
  }

  try {
    const countRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM workshop_signups`).first<{ c: number }>();
    const result = await env.DB.prepare(
      `SELECT s.id, s.name, s.email, s.company, s.role, s.primary_interest, s.question,
              s.language, s.source_path, s.event_id, s.created_at,
              e.title_vi, e.title_en
       FROM workshop_signups s
       LEFT JOIN workshop_events e ON e.id = s.event_id
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
    )
      .bind(limit, offset)
      .all<SignupRow>();

    return jsonResponse(
      {
        ok: true,
        signups: (result.results ?? []).map(mapSignup),
        total: countRow?.c ?? 0,
        limit,
        offset,
      },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  } catch (e) {
    console.error('workshop-admin signups list error', e);
    return jsonResponse(
      { ok: false, error: 'server_error', message: lang === 'en' ? 'Server error.' : 'Lỗi hệ thống.' },
      { status: 500 },
    );
  }
};
