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
