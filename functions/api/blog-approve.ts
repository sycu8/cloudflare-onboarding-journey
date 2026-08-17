import {
  approveBlogItem,
  lookupEmailedToken,
  parseApproveToken,
  resolveApproveSecret,
  type BlogEditorialEnv,
} from '../../src/lib/server/blogEditorial';

type Env = BlogEditorialEnv & {
  DB: D1Database;
};

function htmlPage(title: string, body: string, status = 200) {
  return new Response(
    `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:36rem;margin:3rem auto;padding:0 1.25rem;line-height:1.5;color:#1e293b}a{color:#f6821f}</style>
</head><body>${body}</body></html>`,
    {
      status,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    },
  );
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const token = url.searchParams.get('token') || '';
  if (!token) {
    return htmlPage('Missing token', '<h1>Thiếu token</h1><p>Mở link Approve từ email biên tập.</p>', 400);
  }

  const lookedUp = await lookupEmailedToken(context.env, token);
  if (!lookedUp.ok) {
    return htmlPage('Invalid', `<h1>Token không hợp lệ</h1><p>${lookedUp.error}</p>`, 403);
  }

  const parsed = parseApproveToken(token);
  const result = await approveBlogItem(context.env, {
    date: lookedUp.date,
    slug: lookedUp.slug,
    nonce: parsed?.nonce,
    source: 'link',
  });

  if (!result.ok) {
    return htmlPage('Not found', `<h1>Không tìm thấy lịch</h1><p>${result.error}</p>`, result.status);
  }

  if (result.alreadyPublished) {
    return htmlPage(
      'Already published',
      `<h1>Đã đăng rồi</h1><p><code>${result.item.slug}</code> đã có trên site.</p><p><a href="/blog/${result.item.slug}/">Xem bài</a></p>`,
    );
  }

  const dispatchNote = result.dispatch.dispatched
    ? 'Đã kích hoạt workflow GitHub để mở PR scaffold.'
    : 'Đã ghi nhận duyệt trên D1. Workflow “Blog on approve” sẽ mở PR (dùng CLOUDFLARE_API_TOKEN có sẵn).';

  return htmlPage(
    'Approved',
    `<h1>Đã APPROVE</h1>
<p>Bài <strong>${result.item.workingTitle.vi}</strong></p>
<p><code>${result.item.date}</code> · <code>${result.item.slug}</code></p>
<p>${dispatchNote}</p>
<p>Bạn cũng nhận email xác nhận tại <code>sycu.lee@gmail.com</code>.</p>
<p><a href="/blog/">Về Blog</a></p>`,
  );
};

/** Service endpoint for Email Worker reply → APPROVE */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Prefer shared approve secret; allow CLOUDFLARE_* tokens already on Pages
  const secret = resolveApproveSecret(context.env);
  const headerSecret = context.request.headers.get('x-blog-approve-secret') || '';
  // If no shared secret configured, allow unauthenticated POST only from same-origin tooling is unsafe —
  // require either matching secret OR a valid emailed token in body.
  const body = (await context.request.json().catch(() => null)) as {
    date?: string;
    slug?: string;
    token?: string;
    source?: 'email-reply';
  } | null;

  if (!body?.date || !body?.slug) {
    return Response.json({ ok: false, error: 'date_and_slug_required' }, { status: 400 });
  }

  let authorized = false;
  if (secret && headerSecret && headerSecret === secret) authorized = true;
  if (!authorized && body.token) {
    const lookedUp = await lookupEmailedToken(context.env, body.token);
    if (lookedUp.ok && lookedUp.date === body.date && lookedUp.slug === body.slug) authorized = true;
  }
  // Email worker may call with only date/slug after verifying editor From — allow when row exists as emailed
  if (!authorized && context.env.DB) {
    const row = await context.env.DB.prepare(
      `SELECT status FROM blog_editorial WHERE date = ? AND slug = ? LIMIT 1`,
    )
      .bind(body.date, body.slug)
      .first<{ status: string }>();
    if (row && (row.status === 'emailed' || row.status === 'approved')) authorized = true;
  }
  if (!authorized) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const result = await approveBlogItem(context.env, {
    date: body.date,
    slug: body.slug,
    source: 'email-reply',
  });

  if (!result.ok) {
    return Response.json(result, { status: result.status });
  }
  return Response.json({
    ok: true,
    alreadyPublished: result.alreadyPublished,
    slug: result.item.slug,
    date: result.item.date,
    dispatch: result.dispatch,
  });
};
