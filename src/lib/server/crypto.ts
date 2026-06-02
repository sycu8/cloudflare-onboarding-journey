async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashIp(ip: string | null, salt: string) {
  if (!ip) return null;
  return await sha256Hex(`${salt}|ip|${ip}`);
}

export async function hashUserAgent(ua: string | null, salt: string) {
  if (!ua) return null;
  return await sha256Hex(`${salt}|ua|${ua}`);
}

export function randomId(prefix = 'id') {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}_${hex}`;
}

