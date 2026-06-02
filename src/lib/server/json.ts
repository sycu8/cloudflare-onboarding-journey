export function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init?.headers ?? {}),
    },
  });
}

export async function readJson(request: Request, maxBytes = 50_000) {
  const ct = request.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('application/json')) {
    throw new Error('invalid_content_type');
  }
  const len = Number(request.headers.get('content-length') || '0');
  if (len && len > maxBytes) {
    throw new Error('body_too_large');
  }
  return await request.json();
}

