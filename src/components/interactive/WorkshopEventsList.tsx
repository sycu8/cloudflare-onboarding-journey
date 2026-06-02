import { useEffect, useState } from 'react';
import type { WorkshopEvent } from '../../types/workshop';
import { usePageLang } from '../../lib/usePageLang';

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  onLoaded?: (count: number) => void;
};

function formatEventDate(iso: string, lang: 'vi' | 'en', timeZone: string) {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const formatLabels: Record<WorkshopEvent['format'], { vi: string; en: string }> = {
  online: { vi: 'Trực tuyến', en: 'Online' },
  'in-person': { vi: 'Trực tiếp', en: 'In person' },
  hybrid: { vi: 'Kết hợp', en: 'Hybrid' },
};

export default function WorkshopEventsList({ selectedId, onSelect, onLoaded }: Props) {
  const [events, setEvents] = useState<WorkshopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/workshop-events')
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok || !data?.ok) {
          setError(true);
          onLoaded?.(0);
          return;
        }
        const list = (data.events ?? []) as WorkshopEvent[];
        setEvents(list);
        onLoaded?.(list.length);
        if (list.length === 1) onSelect(list[0].id);
      })
      .catch(() => {
        setError(true);
        onLoaded?.(0);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const lang = usePageLang();

  if (loading) {
    return (
      <div className="card text-muted text-sm">
        <span className="lang-vi">Đang tải lịch workshop…</span>
        <span className="lang-en">Loading workshop schedule…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-muted text-sm">
        <span className="lang-vi">Chưa tải được lịch sự kiện. Bạn vẫn có thể đăng ký chung bên dưới.</span>
        <span className="lang-en">Could not load events. You can still submit a general registration below.</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold">
          <span className="lang-vi">Lịch workshop</span>
          <span className="lang-en">Workshop schedule</span>
        </h2>
        <p className="text-muted mt-2 text-sm">
          <span className="lang-vi">Chưa có sự kiện sắp tới. Đăng ký trước — chúng tôi sẽ liên hệ khi có lịch mới.</span>
          <span className="lang-en">No upcoming events yet. Register your interest — we will contact you when dates are announced.</span>
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">
        <span className="lang-vi">Chọn sự kiện workshop</span>
        <span className="lang-en">Choose a workshop event</span>
      </h2>
      <ul className="space-y-3">
        {events.map((event) => {
          const selected = selectedId === event.id;
          const title = lang === 'en' ? event.title.en : event.title.vi;
          const desc = lang === 'en' ? event.description.en : event.description.vi;
          const loc = event.location ? (lang === 'en' ? event.location.en : event.location.vi) : null;
          return (
            <li key={event.id}>
              <button
                type="button"
                className={`card w-full text-left transition ${selected ? 'ring-2 ring-[var(--cf-accent)]' : 'hover:brightness-105'}`}
                onClick={() => onSelect(event.id)}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-accent">{formatLabels[event.format][lang]}</span>
                  <span className="text-muted text-xs">
                    {formatEventDate(event.startsAt, lang, event.timezone)}
                  </span>
                </div>
                <p className="mt-2 font-semibold">{title}</p>
                {desc ? <p className="text-muted mt-1 text-sm">{desc}</p> : null}
                {loc ? (
                  <p className="text-muted mt-1 text-xs">
                    <span className="lang-vi">Địa điểm: </span>
                    <span className="lang-en">Location: </span>
                    {loc}
                  </p>
                ) : null}
                {event.capacity ? (
                  <p className="text-muted mt-1 text-xs">
                    <span className="lang-vi">Sức chứa ~{event.capacity} người</span>
                    <span className="lang-en">Capacity ~{event.capacity}</span>
                  </p>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
