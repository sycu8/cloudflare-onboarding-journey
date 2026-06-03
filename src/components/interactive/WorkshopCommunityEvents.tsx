import { usePageLang } from '../../lib/usePageLang';
import { splitCommunityEvents, type CommunityEvent } from '../../data/communityEvents';

const formatLabels: Record<CommunityEvent['format'], { vi: string; en: string }> = {
  online: { vi: 'Trực tuyến', en: 'Online' },
  'in-person': { vi: 'Trực tiếp', en: 'In person' },
  hybrid: { vi: 'Kết hợp', en: 'Hybrid' },
};

function formatRange(event: CommunityEvent, lang: 'vi' | 'en') {
  const locale = lang === 'en' ? 'en-US' : 'vi-VN';
  const opts: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: event.timezone,
  };
  const start = new Intl.DateTimeFormat(locale, opts).format(new Date(event.startsAt));
  const endTime = new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
    timeZone: event.timezone,
  }).format(new Date(event.endsAt));
  return `${start} – ${endTime}`;
}

function EventCard({ event, past }: { event: CommunityEvent; past?: boolean }) {
  const lang = usePageLang();
  const title = lang === 'en' ? event.title.en : event.title.vi;
  const summary = lang === 'en' ? event.summary.en : event.summary.vi;
  const location = lang === 'en' ? event.location.en : event.location.vi;
  const language = lang === 'en' ? event.language.en : event.language.vi;
  const highlights = lang === 'en' ? event.highlights.en : event.highlights.vi;
  const notes = lang === 'en' ? event.notes.en : event.notes.vi;
  const contact = lang === 'en' ? event.contact.en : event.contact.vi;

  return (
    <article className="card space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`badge ${past ? '' : 'badge-accent'}`}>
          {past ? (
            <>
              <span className="lang-vi">Đã qua</span>
              <span className="lang-en">Past</span>
            </>
          ) : (
            <>
              <span className="lang-vi">Sắp tới</span>
              <span className="lang-en">Upcoming</span>
            </>
          )}
        </span>
        <span className="badge">{formatLabels[event.format][lang]}</span>
        {event.free ? (
          <span className="badge">
            <span className="lang-vi">Miễn phí</span>
            <span className="lang-en">Free</span>
          </span>
        ) : null}
        <span className="text-muted text-xs">Luma</span>
      </div>

      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted mt-1 text-sm">{formatRange(event, lang)}</p>
      </div>

      <p className="text-sm">{summary}</p>

      <dl className="text-muted grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-[var(--cf-text)]">
            <span className="lang-vi">Địa điểm</span>
            <span className="lang-en">Location</span>
          </dt>
          <dd>{location}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--cf-text)]">
            <span className="lang-vi">Ngôn ngữ</span>
            <span className="lang-en">Language</span>
          </dt>
          <dd>{language}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--cf-text)]">
            <span className="lang-vi">Host</span>
            <span className="lang-en">Host</span>
          </dt>
          <dd>{event.host}</dd>
        </div>
      </dl>

      <div>
        <h4 className="text-sm font-semibold">
          <span className="lang-vi">Diễn giả</span>
          <span className="lang-en">Speakers</span>
        </h4>
        <ul className="text-muted mt-2 space-y-1 text-sm">
          {event.speakers.map((speaker) => (
            <li key={speaker.name}>
              <span className="text-[var(--cf-text)] font-medium">{speaker.name}</span>
              {' · '}
              {lang === 'en' ? speaker.role.en : speaker.role.vi}
            </li>
          ))}
        </ul>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm">
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {notes.length ? (
        <ul className="text-muted space-y-1 text-xs">
          {notes.map((note) => (
            <li key={note}>⚡ {note}</li>
          ))}
        </ul>
      ) : null}

      <p className="text-muted text-xs">{contact}</p>

      {!past ? (
        <a className="btn btn-primary inline-flex" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
          <span className="lang-vi">Đăng ký trên Luma</span>
          <span className="lang-en">Register on Luma</span>
        </a>
      ) : (
        <a className="link text-sm" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
          <span className="lang-vi">Xem trang sự kiện</span>
          <span className="lang-en">View event page</span>
        </a>
      )}
    </article>
  );
}

function EventSection({
  titleVi,
  titleEn,
  events,
  past,
}: {
  titleVi: string;
  titleEn: string;
  events: CommunityEvent[];
  past?: boolean;
}) {
  if (!events.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        <span className="lang-vi">{titleVi}</span>
        <span className="lang-en">{titleEn}</span>
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} past={past} />
        ))}
      </div>
    </section>
  );
}

export default function WorkshopCommunityEvents() {
  const { upcoming, past } = splitCommunityEvents();

  if (!upcoming.length && !past.length) return null;

  return (
    <div className="space-y-8">
      <EventSection titleVi="Sự kiện sắp tới" titleEn="Upcoming events" events={upcoming} />
      <EventSection titleVi="Sự kiện đã qua" titleEn="Past events" events={past} past />
    </div>
  );
}
