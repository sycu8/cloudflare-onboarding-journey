import {
  BLOG_APPROVE_INBOX,
  BLOG_EDITOR_EMAIL,
  getScheduleItemByDate,
  getScheduleItemBySlug,
  getScheduleStatus,
  type BlogScheduleItem,
} from '../../data/blogSchedule';
import { sendTransactionalEmail, type MailEnv } from './workshopEmail';

export type BlogEditorialEnv = MailEnv & {
  DB?: D1Database;
  BLOG_APPROVE_SECRET?: string;
  BLOG_EDITOR_EMAIL?: string;
  BLOG_APPROVE_INBOX?: string;
  BLOG_GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
};

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const bytes = new Uint8Array(sig);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Token format: date:slug:nonce.signature */
export async function verifyApproveToken(
  token: string,
  secret: string,
): Promise<{ ok: true; date: string; slug: string; nonce: string } | { ok: false; error: string }> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return { ok: false, error: 'invalid_token' };
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await hmacSign(secret, payload);
  if (!timingSafeEqual(sig, expected)) return { ok: false, error: 'bad_signature' };
  const [date, slug, nonce] = payload.split(':');
  if (!date || !slug || !nonce) return { ok: false, error: 'bad_payload' };
  return { ok: true, date, slug, nonce };
}

export function editorEmail(env: BlogEditorialEnv) {
  return (env.BLOG_EDITOR_EMAIL || BLOG_EDITOR_EMAIL).toLowerCase();
}

export function approveInbox(env: BlogEditorialEnv) {
  return env.BLOG_APPROVE_INBOX || BLOG_APPROVE_INBOX;
}

export async function recordEditorialEvent(
  env: BlogEditorialEnv,
  input: {
    date: string;
    slug: string;
    status: 'emailed' | 'approved' | 'pr_opened' | 'published';
    tokenNonce?: string;
    prUrl?: string;
    note?: string;
  },
) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      `INSERT INTO blog_editorial (
         date, slug, status, token_nonce, pr_url, note, updated_at, created_at
       ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
       ON CONFLICT(date, slug) DO UPDATE SET
         status = excluded.status,
         token_nonce = COALESCE(excluded.token_nonce, blog_editorial.token_nonce),
         pr_url = COALESCE(excluded.pr_url, blog_editorial.pr_url),
         note = COALESCE(excluded.note, blog_editorial.note),
         updated_at = datetime('now')`,
    )
      .bind(
        input.date,
        input.slug,
        input.status,
        input.tokenNonce ?? null,
        input.prUrl ?? null,
        input.note ?? null,
      )
      .run();
  } catch (e) {
    console.warn('blog_editorial upsert skipped', e);
  }
}

async function dispatchGithubApprove(
  env: BlogEditorialEnv,
  item: BlogScheduleItem,
  source: 'link' | 'email-reply',
) {
  const token = env.BLOG_GITHUB_TOKEN;
  const repo = env.GITHUB_REPO || 'sycu8/cloudflare-onboarding-journey';
  if (!token) {
    console.warn('blog approve: BLOG_GITHUB_TOKEN missing — recorded in D1 only');
    return { dispatched: false as const, reason: 'missing_github_token' };
  }
  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'cloudflare-starter-hub-blog-approve',
    },
    body: JSON.stringify({
      event_type: 'blog-approved',
      client_payload: {
        date: item.date,
        slug: item.slug,
        topic: item.topic,
        level: item.level,
        title_vi: item.workingTitle.vi,
        title_en: item.workingTitle.en,
        source,
        editor: editorEmail(env),
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error('github dispatch failed', res.status, body);
    return { dispatched: false as const, reason: `github_${res.status}` };
  }
  return { dispatched: true as const };
}

export async function approveBlogItem(
  env: BlogEditorialEnv,
  input: { date: string; slug: string; nonce?: string; source: 'link' | 'email-reply' },
) {
  const item = getScheduleItemByDate(input.date) || getScheduleItemBySlug(input.slug);
  if (!item || item.slug !== input.slug || item.date !== input.date) {
    return { ok: false as const, error: 'unknown_schedule_item', status: 404 };
  }
  if (getScheduleStatus(item) === 'published') {
    return { ok: true as const, alreadyPublished: true, item };
  }

  await recordEditorialEvent(env, {
    date: item.date,
    slug: item.slug,
    status: 'approved',
    tokenNonce: input.nonce,
    note: `approved_via_${input.source}`,
  });

  const dispatch = await dispatchGithubApprove(env, item, input.source);

  await sendTransactionalEmail(env, {
    to: editorEmail(env),
    subject: `[Blog] Đã nhận APPROVE — ${item.date} ${item.slug}`,
    text: `Đã duyệt bài ${item.slug} (${item.date}).\nNguồn: ${input.source}\nGitHub dispatch: ${dispatch.dispatched ? 'ok' : dispatch.reason}\n\nWorkflow sẽ mở PR scaffold. Merge PR (+ deploy) để đăng bài lên site.`,
    html: `<p>Đã duyệt bài <strong>${item.slug}</strong> (${item.date}).</p>
<p>Nguồn: <code>${input.source}</code></p>
<p>GitHub dispatch: ${dispatch.dispatched ? 'ok' : dispatch.reason}</p>
<p>Workflow sẽ mở PR scaffold. <strong>Merge PR</strong> (sau khi viết đủ nội dung) để đăng.</p>`,
  });

  return { ok: true as const, item, dispatch, alreadyPublished: false };
}

export function isEditorSender(fromHeader: string, env: BlogEditorialEnv): boolean {
  const want = editorEmail(env);
  const lower = fromHeader.toLowerCase();
  if (lower.includes(`<${want}>`)) return true;
  if (lower.trim() === want) return true;
  // bare address in From
  const m = lower.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/);
  return Boolean(m && m[1] === want);
}

export function bodyHasApprove(text: string): boolean {
  const normalized = text.replace(/\r/g, '\n');
  // Prefer a standalone APPROVE line (ignore quoted replies later)
  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('>') && !l.toLowerCase().startsWith('on ') && !l.startsWith('From:'));
  for (const line of lines.slice(0, 8)) {
    if (/^approve\.?$/i.test(line)) return true;
  }
  return /\bAPPROVE\b/i.test(lines.slice(0, 5).join(' '));
}

/** Parse `[Blog] Duyệt bài YYYY-MM-DD: slug` subjects. */
export function parseApproveSubject(subject: string): { date: string; slug: string } | null {
  const m = subject.match(/(\d{4}-\d{2}-\d{2})\s*:\s*([a-z0-9-]+)/i);
  if (!m) return null;
  return { date: m[1], slug: m[2].toLowerCase() };
}
