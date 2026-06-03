import { useState } from 'react';
import { adminFetch } from '../../lib/adminApi';
import type { WorkshopEvent, WorkshopEventFormat, WorkshopEventStatus } from '../../types/workshop';
import { usePageLang } from '../../lib/usePageLang';

type Interest = 'application-services' | 'developer-platform' | 'cloudflare-one' | 'not-sure';

function toIsoFromLocal(local: string) {
  if (!local) return '';
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

type Props = {
  events: WorkshopEvent[];
  onCreated: () => void;
};

export default function WorkshopEventsAdmin({ events, onCreated }: Props) {
  const lang = usePageLang();
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
      const res = await adminFetch('/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cfhub-lang': lang },
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
      onCreated();
    } catch {
      setError(lang === 'en' ? 'Could not create event.' : 'Không tạo được sự kiện.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form className="card space-y-4" onSubmit={createEvent}>
        <h2 className="font-semibold">
          <span className="lang-vi">Thêm sự kiện mới</span>
          <span className="lang-en">Add new event</span>
        </h2>

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
            <input className="cf-input mt-1" type="datetime-local" required value={startsAtLocal} onChange={(e) => setStartsAtLocal(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="lang-vi">Kết thúc (tuỳ chọn)</span>
            <span className="lang-en">Ends (optional)</span>
            <input className="cf-input mt-1" type="datetime-local" value={endsAtLocal} onChange={(e) => setEndsAtLocal(e.target.value)} />
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
            <select className="cf-input mt-1" value={primaryInterest} onChange={(e) => setPrimaryInterest(e.target.value as Interest | '')}>
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

        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
          <span className="lang-vi">{loading ? 'Đang lưu…' : 'Tạo sự kiện'}</span>
          <span className="lang-en">{loading ? 'Saving…' : 'Create event'}</span>
        </button>
      </form>

      {events.length > 0 ? (
        <div className="card overflow-x-auto">
          <h2 className="mb-3 font-semibold">
            <span className="lang-vi">Tất cả sự kiện</span>
            <span className="lang-en">All events</span>
          </h2>
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
      ) : (
        <div className="card text-muted text-sm">
          <span className="lang-vi">Chưa có sự kiện nào.</span>
          <span className="lang-en">No events yet.</span>
        </div>
      )}
    </div>
  );
}
