import { jsonResponse } from './json';

const DEV_BYPASS_TOKEN = 'dev-bypass';

export async function verifyTurnstile(opts: {
  secret: string | undefined;
  token: string;
  ip?: string | null;
}) {
  if (!opts.secret) {
    if (opts.token === DEV_BYPASS_TOKEN) return { ok: true as const, data: { success: true, dev: true } };
    return { ok: false as const, error: 'missing_secret' as const };
  }

  if (opts.token === DEV_BYPASS_TOKEN) {
    return { ok: false as const, error: 'invalid_token' as const };
  }

  const form = new URLSearchParams();
  form.set('secret', opts.secret);
  form.set('response', opts.token);
  if (opts.ip) form.set('remoteip', opts.ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    return { ok: false as const, error: 'verify_failed' as const };
  }
  const data: any = await res.json();
  return { ok: Boolean(data?.success), data };
}

export function turnstileError(lang: 'vi' | 'en') {
  return jsonResponse(
    {
      ok: false,
      error: 'turnstile_failed',
      message:
        lang === 'en'
          ? 'Turnstile verification failed.'
          : 'Xác minh Turnstile thất bại.',
    },
    { status: 400 },
  );
}

