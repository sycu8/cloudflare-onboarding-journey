import {
  approveBlogItem,
  verifyApproveToken,
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
  const secret = context.env.BLOG_APPROVE_SECRET;
  if (!secret) {
    return htmlPage('Misconfigured', '<h1>Thiếu BLOG_APPROVE_SECRET</h1><p>Thêm secret trên Pages rồi deploy lại.</p>', 500);
  }
  if (!token) {
    return htmlPage('Missing token', '<h1>Thiếu token</h1><p>Mở link Approve từ email biên tập.</p>', 400);
  }

  const verified = await verifyApproveToken(token, secret);
  if (!verified.ok) {
    return htmlPage('Invalid', `<h1>Token không hợp lệ</h1><p>${verified.error}</p>`, 403);
  }

  const result = await approveBlogItem(context.env, {
    date: verified.date,
    slug: verified.slug,
    nonce: verified.nonce,
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
    : `Ghi nhận duyệt, nhưng chưa dispatch GitHub (${'reason' in result.dispatch ? result.dispatch.reason : 'unknown'}). Kiểm tra secret BLOG_GITHUB_TOKEN.`;

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
  const secret = context.env.BLOG_APPROVE_SECRET;
  if (!secret) return Response.json({ ok: false, error: 'missing_secret' }, { status: 500 });

  const headerSecret = context.request.headers.get('x-blog-approve-secret') || '';
  if (headerSecret !== secret) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const body = (await context.request.json().catch(() => null)) as {
    date?: string;
    slug?: string;
    source?: 'email-reply';
  } | null;

  if (!body?.date || !body?.slug) {
    return Response.json({ ok: false, error: 'date_and_slug_required' }, { status: 400 });
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
