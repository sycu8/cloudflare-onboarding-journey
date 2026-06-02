import { jsonResponse } from './json';

type KVNamespaceLike = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, opts?: { expirationTtl?: number }) => Promise<void>;
};

export async function rateLimitOrThrow(opts: {
  kv: KVNamespaceLike | undefined;
  key: string;
  windowSeconds: number;
  max: number;
}) {
  if (!opts.kv) return { allowed: true as const }; // If KV not bound, don't hard-fail v1.

  const current = Number((await opts.kv.get(opts.key)) || '0');
  if (Number.isFinite(current) && current >= opts.max) {
    return { allowed: false as const, current };
  }
  const next = current + 1;
  await opts.kv.put(opts.key, String(next), { expirationTtl: opts.windowSeconds });
  return { allowed: true as const, current: next };
}

export function rateLimitedResponse(lang: 'vi' | 'en') {
  return jsonResponse(
    {
      ok: false,
      error: 'rate_limited',
      message:
        lang === 'en'
          ? 'Too many requests. Please try again later.'
          : 'Bạn gửi quá nhiều lần. Vui lòng thử lại sau.',
    },
    { status: 429 },
  );
}

