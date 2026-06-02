export const onRequestPost: PagesFunction<{
  AI: {
    run: (model: string, input: unknown) => Promise<unknown>;
  };
}> = async ({ request, env }) => {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const lang = body?.lang === 'en' ? 'en' : 'vi';

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt' }), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  // Workers AI binding available on Cloudflare Pages Functions via env.AI.
  // Model choice: keep it simple + cheap for MVP; can be swapped later.
  const model = '@cf/meta/llama-3.1-8b-instruct';
  const system =
    lang === 'en'
      ? 'You are a Cloudflare learning assistant. Be concise, beginner-friendly, and actionable.'
      : 'Bạn là trợ lý học Cloudflare. Viết ngắn gọn, dễ hiểu cho người mới và có bước hành động rõ ràng.';

  const result = await env.AI.run(model, {
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content:
          lang === 'en'
            ? `Generate learning content for: ${prompt}\nFormat: 5 bullets + 1 next-step CTA.`
            : `Tạo nội dung học cho chủ đề: ${prompt}\nĐịnh dạng: 5 gạch đầu dòng + 1 CTA bước tiếp theo.`,
      },
    ],
  });

  return new Response(JSON.stringify({ result }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // This is user-specific / prompt-specific: do not cache by default.
      'cache-control': 'no-store',
    },
  });
};

