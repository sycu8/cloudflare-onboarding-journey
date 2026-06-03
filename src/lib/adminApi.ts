/** Admin API under /admin/api — same Cloudflare Access app as /admin/ UI. */
export const ADMIN_API_BASE = '/admin/api';

export function adminFetch(path: string, init?: RequestInit) {
  return fetch(`${ADMIN_API_BASE}${path}`, {
    credentials: 'same-origin',
    ...init,
  });
}
