import { useCallback, useEffect, useState } from 'react';
import type { WorkshopEvent, WorkshopEventFormat, WorkshopEventStatus } from '../../types/workshop';
import {
  adminHeaders,
  clearStoredAdminKey,
  getStoredAdminKey,
  setStoredAdminKey,
} from '../../lib/workshop/adminKey';
import { usePageLang } from '../../lib/usePageLang';

type Interest = 'application-services' | 'developer-platform' | 'cloudflare-one' | 'not-sure';

function toIsoFromLocal(local: string) {
  if (!local) return '';
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

export default function WorkshopAdminPanel() {
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [startsAtLocal, setStartsAtLocal] = useState('');
  const [endsAtLocal, setEndsAtLocal] = useState('');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [format, setFormat] = useState<WorkshopEventFormat>('online');
  const [locationVi, setLocationVi] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [capacity, setCapacity] = useState('');
  const [primaryInterest, setPrimaryInterest] = useState<Interest | ''>('');
  const [status, setStatus] = useState<WorkshopEventStatus>('published');

  const lang = usePageLang();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/workshop-events', { headers: adminHeaders() });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (res.status === 401) {
          clearStoredAdminKey();
          setAuthenticated(false);
          throw new Error('unauthorized');
        }
        throw new Error(data.error || 'load_failed');
      }
      setEvents(data.events ?? []);
      setAuthenticated(true);
    } catch (e) {
      if ((e as Error).message === 'unauthorized') {
        setError(lang === 'en' ? 'Invalid admin key.' : 'Khóa admin không đúng.');
      } else {
        setError(lang === 'en' ? 'Could not load events.' : 'Không tải được danh sách sự kiện.');
      }
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
      void loadEvents();
    }
  }, [loadEvents]);

  function saveKey(e: React.FormEvent) {
    e.preventDefault();
    setStoredAdminKey(adminKey.trim());
    void loadEvents();
  }

  function logout() {
    clearStoredAdminKey();
    setAuthenticated(false);
    setEvents([]);
    setAdminKey('');
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const startsAt = toIsoFromLocal(startsAtLocal);
    if (!startsAt) {
      setError(lang === 'en' ? 'Start time is required.' : 'Cần chọn thời gian bắt đầu.');
      setLoading(false);
      return;
    }

    const body: Record<string, unknown> = {
      titleVi,
      titleEn,
      descriptionVi,
      descriptionEn,
      startsAt,
      timezone,
      format,
      locationVi,
      locationEn,
      status,
    };

    const endsAt = toIsoFromLocal(endsAtLocal);
    if (endsAt) body.endsAt = endsAt;
    if (meetingUrl.trim()) body.meetingUrl = meetingUrl.trim();
    if (capacity.trim()) body.capacity = Number(capacity);
    if (primaryInterest) body.primaryInterest = primaryInterest;

    try {
      const res = await fetch('/api/workshop-events', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cfhub-lang': lang, ...adminHeaders() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'create_failed');
      }
      setMessage(lang === 'en' ? 'Event created.' : 'Đã tạo sự kiện.');
      setTitleVi('');
      setTitleEn('');
      setDescriptionVi('');
      setDescriptionEn('');
      setStartsAtLocal('');
      setEndsAtLocal('');
      setLocationVi('');
      setLocationEn('');
      setMeetingUrl('');
      setCapacity('');
      void loadEvents();
    } catch {
      setError(lang === 'en' ? 'Could not create event.' : 'Không tạo được sự kiện.');
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <form className="card space-y-4" onSubmit={saveKey}>
        <h2 className="text-lg font-semibold">
          <span className="lang-vi">Admin — thêm sự kiện workshop</span>
          <span className="lang-en">Admin — add workshop event</span>
        </h2>
        <p className="text-muted text-sm">
          <span className="lang-vi">Nhập khóa admin (WORKSHOP_ADMIN_KEY trên Cloudflare). Khóa chỉ lưu trong phiên trình duyệt.</span>
          <span className="lang-en">Enter the admin key (WORKSHOP_ADMIN_KEY on Cloudflare). Stored in session only.</span>
        </p>
        <label className="block text-sm">
          <span className="lang-vi">Khóa admin</span>
          <span className="lang-en">Admin key</span>
          <input
            className="cf-input mt-1 font-mono"
            type="password"
            required
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            autoComplete="off"
          />
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          <span className="lang-vi">Đăng nhập admin</span>
          <span className="lang-en">Sign in as admin</span>
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            <span className="lang-vi">Quản lý sự kiện workshop</span>
            <span className="lang-en">Workshop event admin</span>
          </h2>
          <p className="text-muted text-sm">
            <span className="lang-vi">{events.length} sự kiện (gồm draft)</span>
            <span className="lang-en">{events.length} events (including drafts)</span>
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          <span className="lang-vi">Đăng xuất</span>
          <span className="lang-en">Sign out</span>
        </button>
      </div>

      <form className="card space-y-4" onSubmit={createEvent}>
        <h3 className="font-semibold">
          <span className="lang-vi">Thêm sự kiện mới</span>
          <span className="lang-en">Add new event</span>
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="lang-vi">Tiêu đề (VI)</span>
            <span className="lang-en">Title (VI)</span>
            <input className="cf-input mt-1" required value={titleVi} onChange={(e) => setTitleVi(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="lang-en">Title (EN)</span>
            <input className="cf-input mt-1" required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </label>
        </div>

        <label className="block text-sm">
          <span className="lang-vi">Mô tả (VI)</span>
          <span className="lang-en">Description (VI)</span>
          <textarea className="cf-input mt-1 min-h-[80px]" value={descriptionVi} onChange={(e) => setDescriptionVi(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="lang-en">Description (EN)</span>
          <textarea className="cf-input mt-1 min-h-[80px]" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="lang-vi">Bắt đầu</span>
            <span className="lang-en">Starts</span>
            <input
              className="cf-input mt-1"
              type="datetime-local"
              required
              value={startsAtLocal}
              onChange={(e) => setStartsAtLocal(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="lang-vi">Kết thúc (tuỳ chọn)</span>
            <span className="lang-en">Ends (optional)</span>
            <input
              className="cf-input mt-1"
              type="datetime-local"
              value={endsAtLocal}
              onChange={(e) => setEndsAtLocal(e.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm">
            Timezone
            <input className="cf-input mt-1" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </label>
          <label className="block text-sm">
            Format
            <select className="cf-input mt-1" value={format} onChange={(e) => setFormat(e.target.value as WorkshopEventFormat)}>
              <option value="online">Online</option>
              <option value="in-person">In person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="block text-sm">
            Status
            <select className="cf-input mt-1" value={status} onChange={(e) => setStatus(e.target.value as WorkshopEventStatus)}>
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="lang-vi">Địa điểm (VI)</span>
            <input className="cf-input mt-1" value={locationVi} onChange={(e) => setLocationVi(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="lang-en">Location (EN)</span>
            <input className="cf-input mt-1" value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />
          </label>
        </div>

        <label className="block text-sm">
          Meeting URL
          <input className="cf-input mt-1" type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="lang-vi">Sức chứa</span>
            <span className="lang-en">Capacity</span>
            <input className="cf-input mt-1" type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="lang-vi">Track gợi ý</span>
            <span className="lang-en">Suggested track</span>
            <select
              className="cf-input mt-1"
              value={primaryInterest}
              onChange={(e) => setPrimaryInterest(e.target.value as Interest | '')}
            >
              <option value="">—</option>
              <option value="application-services">Application Services</option>
              <option value="developer-platform">Developer Platform</option>
              <option value="cloudflare-one">Cloudflare One</option>
              <option value="not-sure">Not sure</option>
            </select>
          </label>
        </div>

        {message ? <p className="text-sm text-[var(--cf-success,#16a34a)]">{message}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          <span className="lang-vi">{loading ? 'Đang lưu…' : 'Tạo sự kiện'}</span>
          <span className="lang-en">{loading ? 'Saving…' : 'Create event'}</span>
        </button>
      </form>

      {events.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted border-b border-[var(--cf-border)]">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Starts</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-[var(--cf-border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs">{ev.id}</td>
                  <td className="py-2 pr-4">{ev.title.vi}</td>
                  <td className="py-2 pr-4 text-xs">{ev.startsAt}</td>
                  <td className="py-2">
                    <span className="badge">{ev.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
