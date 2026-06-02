export const WORKSHOP_ADMIN_KEY_STORAGE = 'cfhub_workshop_admin_key';

export function getStoredAdminKey(): string | null {
  try {
    return sessionStorage.getItem(WORKSHOP_ADMIN_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function setStoredAdminKey(key: string) {
  sessionStorage.setItem(WORKSHOP_ADMIN_KEY_STORAGE, key);
}

export function clearStoredAdminKey() {
  sessionStorage.removeItem(WORKSHOP_ADMIN_KEY_STORAGE);
}

export function adminHeaders(): HeadersInit {
  const key = getStoredAdminKey();
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}
