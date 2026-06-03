import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../../lib/adminApi';
import type { WorkshopEvent } from '../../types/workshop';
import { usePageLang } from '../../lib/usePageLang';

type Props = {
  events: WorkshopEvent[];
  active: boolean;
  onGoEvents: () => void;
  onGoSignups: () => void;
};

export default function AdminOverview({ events, active, onGoEvents, onGoSignups }: Props) {
  const lang = usePageLang();
  const [signupTotal, setSignupTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSignups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/signups?limit=1', {
        headers: { 'x-cfhub-lang': lang },
      });
      const data = await res.json();
      if (res.ok && data.ok) setSignupTotal(data.total ?? 0);
    } catch {
      setSignupTotal(null);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (active) void loadSignups();
  }, [active, loadSignups]);

  const published = events.filter((e) => e.status === 'published').length;
  const upcoming = events.filter((e) => e.status === 'published' && new Date(e.startsAt) >= new Date()).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-stat card">
          <p className="admin-stat-label">
            <span className="lang-vi">Tổng sự kiện</span>
            <span className="lang-en">Total events</span>
          </p>
          <p className="admin-stat-value">{events.length}</p>
        </div>
        <div className="admin-stat card">
          <p className="admin-stat-label">
            <span className="lang-vi">Đang published</span>
            <span className="lang-en">Published</span>
          </p>
          <p className="admin-stat-value">{published}</p>
        </div>
        <div className="admin-stat card">
          <p className="admin-stat-label">
            <span className="lang-vi">Sắp diễn ra</span>
            <span className="lang-en">Upcoming</span>
          </p>
          <p className="admin-stat-value">{upcoming}</p>
        </div>
        <div className="admin-stat card">
          <p className="admin-stat-label">
            <span className="lang-vi">Đăng ký</span>
            <span className="lang-en">Registrations</span>
          </p>
          <p className="admin-stat-value">{loading ? '…' : (signupTotal ?? '—')}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card space-y-3">
          <h2 className="font-semibold">
            <span className="lang-vi">Thao tác nhanh</span>
            <span className="lang-en">Quick actions</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary text-sm" onClick={onGoEvents}>
              <span className="lang-vi">Tạo sự kiện mới</span>
              <span className="lang-en">Create new event</span>
            </button>
            <button type="button" className="btn btn-secondary text-sm" onClick={onGoSignups}>
              <span className="lang-vi">Xem đăng ký</span>
              <span className="lang-en">View registrations</span>
            </button>
          </div>
        </section>

        <section className="card space-y-3">
          <h2 className="font-semibold">
            <span className="lang-vi">Sự kiện gần nhất</span>
            <span className="lang-en">Latest events</span>
          </h2>
          {events.length === 0 ? (
            <p className="text-muted text-sm">
              <span className="lang-vi">Chưa có sự kiện.</span>
              <span className="lang-en">No events yet.</span>
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {events.slice(0, 5).map((ev) => (
                <li key={ev.id} className="flex items-start justify-between gap-3 border-b border-[var(--cf-border)]/50 pb-2">
                  <span>{ev.title.vi}</span>
                  <span className="badge shrink-0">{ev.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
