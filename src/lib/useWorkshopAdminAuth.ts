import { useCallback, useEffect, useState } from 'react';
import type { WorkshopEvent } from '../types/workshop';
import { adminFetch } from './adminApi';

export type AdminMe = {
  authorized?: boolean;
  email?: string | null;
  accessEmail?: string | null;
  hasAccessHeader?: boolean;
  hasAccessIdentity?: boolean;
  allowlist?: string[];
};

export function useWorkshopAdminAuth(lang: 'vi' | 'en') {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<AdminMe | null>(null);
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const meRes = await adminFetch('/me');
      const me: AdminMe = await meRes.json();
      setAuthInfo(me);

      if (!me?.authorized) {
        setAuthenticated(false);
        setAdminEmail(me?.accessEmail ?? null);
        setEvents([]);
        return;
      }

      const res = await adminFetch('/events');
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setAuthenticated(false);
        setAdminEmail(me.accessEmail ?? null);
        setEvents([]);
        setError(data?.message || (lang === 'en' ? 'Could not load events.' : 'Không tải được danh sách sự kiện.'));
        return;
      }

      setAuthenticated(true);
      setAdminEmail(data.email ?? me.email ?? null);
      setEvents(data.events ?? []);
    } catch {
      setError(lang === 'en' ? 'Could not load admin data.' : 'Không tải được dữ liệu admin.');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void load();
  }, [load]);

  return { authenticated, adminEmail, authInfo, events, loading, error, reload: load, setEvents };
}
