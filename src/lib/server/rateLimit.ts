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

/** Read-only check — does not increment the counter. */
export async function checkRateLimit(opts: {
  kv: KVNamespaceLike | undefined;
  key: string;
  max: number;
}) {
  if (!opts.kv) return { allowed: true as const };
  const current = Number((await opts.kv.get(opts.key)) || '0');
  if (Number.isFinite(current) && current >= opts.max) {
    return { allowed: false as const, current };
  }
  return { allowed: true as const, current };
}

/** Increment after a successful action (e.g. signup saved). */
export async function recordRateLimitHit(opts: {
  kv: KVNamespaceLike | undefined;
  key: string;
  windowSeconds: number;
}) {
  if (!opts.kv) return;
  const current = Number((await opts.kv.get(opts.key)) || '0');
  await opts.kv.put(opts.key, String(current + 1), { expirationTtl: opts.windowSeconds });
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

