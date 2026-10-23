/** Production hostname. Every other host (pages.dev, UAT, localhost) stays out of the index. */
const CANONICAL_HOST = 'onboarding.orangecloud.vn';

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const host = new URL(context.request.url).hostname.toLowerCase();
  if (host === CANONICAL_HOST) return response;
  if (/noindex/i.test(response.headers.get('X-Robots-Tag') || '')) return response;

  try {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
