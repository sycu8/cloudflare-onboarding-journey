/** Constant-time string compare for admin API keys */
export function verifyAdminKey(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;

  const auth = request.headers.get('Authorization');
  const fromBearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : null;
  const provided = fromBearer || request.headers.get('X-Cfhub-Admin-Key')?.trim() || '';
  if (!provided) return false;

  if (provided.length !== secret.length) return false;

  let mismatch = 0;
  for (let i = 0; i < secret.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return mismatch === 0;
}

const DEFAULT_ADMIN_EMAILS = ['sycu.lee@gmail.com'];

export function parseAdminEmails(raw: string | undefined): string[] {
  const list = (raw || DEFAULT_ADMIN_EMAILS.join(','))
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.length ? list : DEFAULT_ADMIN_EMAILS;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const segment = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = segment.padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function emailFromJwtAssertion(request: Request): string | null {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;

  const payload = decodeJwtPayload(jwt);
  if (!payload) return null;

  for (const key of ['email', 'common_name'] as const) {
    const value = payload[key];
    if (typeof value === 'string' && value.includes('@')) return value.trim();
  }
  return null;
}

/** Email from Cloudflare Access headers (direct or JWT assertion). */
export function workshopAdminEmail(request: Request): string | null {
  const direct =
    request.headers.get('CF-Access-Authenticated-User-Email') ||
    request.headers.get('Cf-Access-Authenticated-User-Email');
  if (direct?.trim()) return direct.trim();

  return emailFromJwtAssertion(request);
}

/** True when Cloudflare Access forwarded an identity to origin. */
export function hasAccessIdentity(request: Request): boolean {
  if (workshopAdminEmail(request)) return true;

  return Boolean(
    request.headers.get('Cf-Access-Jwt-Assertion') ||
      request.headers.get('CF-Access-Authenticated-User-Id') ||
      request.headers.get('Cf-Access-Authenticated-User-Id'),
  );
}

/** Cloudflare Access identity or legacy admin key. */
export function verifyWorkshopAdmin(
  request: Request,
  env: { WORKSHOP_ADMIN_KEY?: string; WORKSHOP_ADMIN_EMAILS?: string },
): boolean {
  const email = workshopAdminEmail(request)?.toLowerCase();
  if (email && parseAdminEmails(env.WORKSHOP_ADMIN_EMAILS).includes(email)) return true;
  return verifyAdminKey(request, env.WORKSHOP_ADMIN_KEY);
}
