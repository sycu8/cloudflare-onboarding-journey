import {
  approveBlogItem,
  lookupEmailedToken,
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

  // Email scanners may follow GET links. Only explicit POST may approve.
  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const safeToken = escapeHtml(token);
  const safeDate = escapeHtml(lookedUp.date);
  const safeSlug = escapeHtml(lookedUp.slug);
  return htmlPage(
    'Confirm approval',
    `<h1>Xác nhận duyệt bài</h1><p>Ngày ${safeDate} · ${safeSlug}</p>
<form action="/api/blog-approve" method="post">
<input type="hidden" name="date" value="${safeDate}">
<input type="hidden" name="slug" value="${safeSlug}">
<input type="hidden" name="token" value="${safeToken}">
<button type="submit">Xác nhận APPROVE</button></form>`,
  );
};

/** POST approve: confirmation form (token) or Email Worker (shared secret). */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Dedicated BLOG_APPROVE_SECRET only (see resolveApproveSecret). Token in body still authorizes link confirms.
  const secret = resolveApproveSecret(context.env);
  const headerSecret = context.request.headers.get('x-blog-approve-secret') || '';
  const contentType = context.request.headers.get('content-type') || '';
  const formRequest = contentType.toLowerCase().startsWith('application/x-www-form-urlencoded');
  const fields = formRequest ? await context.request.formData().catch(() => null) : null;
  const body = (formRequest ? {
    date: fields?.get('date'),
    slug: fields?.get('slug'),
    token: fields?.get('token'),
  } : await context.request.json().catch(() => null)) as {
    date?: string;
    slug?: string;
    token?: string;
    source?: 'email-reply';
  } | null;

  if (typeof body?.date !== 'string' || typeof body?.slug !== 'string') {
    return Response.json({ ok: false, error: 'date_and_slug_required' }, { status: 400 });
  }

  if (formRequest && typeof body.token !== 'string') {
    return htmlPage('Invalid', '<h1>Thiếu token</h1>', 401);
  }

  let authorized = false;
  if (secret && headerSecret && headerSecret === secret) authorized = true;
  if (!authorized && body.token) {
    const lookedUp = await lookupEmailedToken(context.env, body.token);
    if (lookedUp.ok && lookedUp.date === body.date && lookedUp.slug === body.slug) authorized = true;
  }
  if (!authorized) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const result = await approveBlogItem(context.env, {
    date: body.date,
    slug: body.slug,
    source: formRequest ? 'link' : 'email-reply',
  });

  if (!result.ok) {
    return Response.json(result, { status: result.status });
  }
  if (formRequest) {
    return htmlPage('Approved', result.alreadyPublished
      ? '<h1>Bài đã được đăng trước đó</h1><p><a href="/blog/">Về Blog</a></p>'
      : '<h1>Đã ghi nhận APPROVE</h1><p>Đang chờ PR, kiểm thử và xuất bản.</p>');
  }
  return Response.json({
    ok: true,
    alreadyPublished: result.alreadyPublished,
    slug: result.item.slug,
    date: result.item.date,
    dispatch: result.dispatch,
  });
};
