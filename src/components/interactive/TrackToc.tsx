import { useEffect, useMemo, useState } from 'react';
import type { LessonKind } from '../../data/lessonKind';
import {
  TRACK_PROGRESS_EVENT,
  loadTrackProgress,
  toggleTrackProgress,
  type TrackProgressMap,
} from '../../lib/trackProgress';

type Text = { vi: string; en: string; km?: string };

export type TrackTocItem = {
  key: string;
  kind: LessonKind;
  href: string;
  title: Text;
  moduleId: string;
  moduleTitle: Text;
  duration?: Text | null;
};

type Filter = 'all' | 'knowledge' | 'lab';

const kindLabel: Record<LessonKind, { vi: string; en: string }> = {
  knowledge: { vi: 'Kiến thức', en: 'Knowledge' },
  'lab-hub': { vi: 'Lab (hub)', en: 'Lab (hub)' },
  'lab-official': { vi: 'Lab (Cloudflare)', en: 'Lab (Cloudflare)' },
};

function minutesOf(duration?: Text | null): number | undefined {
  if (!duration) return undefined;
  const match = `${duration.en} ${duration.vi}`.match(/(\d+)\s*(min|phút)/i);
  return match ? Number(match[1]) : undefined;
}

export default function TrackToc({
  trackSlug,
  items,
  currentKey = '',
}: {
  trackSlug: string;
  items: TrackTocItem[];
  currentKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [progress, setProgress] = useState<TrackProgressMap>({});

  useEffect(() => {
    const sync = () => setProgress(loadTrackProgress());
    sync();
    window.addEventListener(TRACK_PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(TRACK_PROGRESS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (filter === 'knowledge') return item.kind === 'knowledge';
        if (filter === 'lab') return item.kind !== 'knowledge';
        return true;
      }),
    [items, filter],
  );

  const doneCount = items.filter((item) => progress[item.key]).length;
  const remaining = items.filter((item) => !progress[item.key]);
  const remainingMinutes = remaining.reduce((sum, item) => sum + (minutesOf(item.duration) ?? 0), 0);
  const timedRemaining = remaining.filter((item) => minutesOf(item.duration) != null).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const groups: { moduleId: string; moduleTitle: Text; items: TrackTocItem[] }[] = [];
  for (const item of visible) {
    const last = groups[groups.length - 1];
    if (!last || last.moduleId !== item.moduleId) {
      groups.push({ moduleId: item.moduleId, moduleTitle: item.moduleTitle, items: [item] });
    } else {
      last.items.push(item);
    }
  }

  function toggle(key: string) {
    setProgress(toggleTrackProgress(key));
  }

  return (
    <nav className="track-toc" aria-label="Track contents" data-track-toc={trackSlug}>
      <button
        type="button"
        className="track-toc-toggle btn btn-secondary w-full justify-between"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          <span className="lang-vi">Mục lục và tiến độ</span>
          <span className="lang-en">Contents and progress</span>
          <span className="lang-km">Contents and progress</span>
        </span>
        <span className="text-muted text-xs">
          {doneCount}/{items.length}
        </span>
      </button>

      <div className={`track-toc-panel ${open ? 'is-open' : ''}`}>
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold">
              {pct}%{' '}
              <span className="text-muted font-normal">
                <span className="lang-vi">{doneCount}/{items.length} bài</span>
                <span className="lang-en">{doneCount}/{items.length} lessons</span>
                <span className="lang-km">{doneCount}/{items.length} lessons</span>
              </span>
            </p>
          </div>
          <div className="cf-progress-track mt-2 h-1.5 rounded-full" aria-hidden="true">
            <div className="cf-progress-bar h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-muted mt-2 text-[0.7rem] leading-relaxed">
            <span className="lang-vi">Lưu trên trình duyệt này.</span>
            <span className="lang-en">Saved in this browser.</span>
            <span className="lang-km">Saved in this browser.</span>
            {timedRemaining > 0 ? (
              <>
                {' '}
                <span className="lang-vi">Còn khoảng {remainingMinutes} phút ở {timedRemaining} bài có ghi giờ.</span>
                <span className="lang-en">About {remainingMinutes} min left across {timedRemaining} timed lessons.</span>
                <span className="lang-km">About {remainingMinutes} min left across {timedRemaining} timed lessons.</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="mb-3 flex flex-wrap gap-1" role="group" aria-label="Filter">
          {(
            [
              ['all', 'Tất cả', 'All'],
              ['knowledge', 'Chỉ kiến thức', 'Knowledge only'],
              ['lab', 'Chỉ lab', 'Labs only'],
            ] as const
          ).map(([id, vi, en]) => (
            <button
              key={id}
              type="button"
              className={`badge ${filter === id ? 'badge-accent' : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              <span className="lang-vi">{vi}</span>
              <span className="lang-en">{en}</span>
              <span className="lang-km">{en}</span>
            </button>
          ))}
        </div>

        <ol className="space-y-3">
          {groups.map((group) => (
            <li key={group.moduleId}>
              <a className="text-muted hover:text-[var(--cf-accent)] text-[0.7rem] font-semibold uppercase tracking-wide" href={`/tracks/${trackSlug}/#${group.moduleId}`}>
                <span className="lang-vi">{group.moduleTitle.vi}</span>
                <span className="lang-en">{group.moduleTitle.en}</span>
                <span className="lang-km">{group.moduleTitle.km ?? group.moduleTitle.en}</span>
              </a>
              <ul className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const current = item.key === currentKey;
                  return (
                    <li key={item.key} className={current ? 'track-toc-current' : ''}>
                      <div className="flex items-start gap-1.5 px-1 py-1">
                        <input
                          type="checkbox"
                          className="mt-1 h-3.5 w-3.5 shrink-0 accent-[var(--cf-accent)]"
                          checked={Boolean(progress[item.key])}
                          onChange={() => toggle(item.key)}
                          aria-label={item.title.en}
                        />
                        <a href={item.href} className="min-w-0 flex-1 no-underline" aria-current={current ? 'page' : undefined}>
                          <span className={`block text-[0.8rem] leading-snug ${current ? 'font-semibold' : ''} ${progress[item.key] ? 'text-muted line-through' : ''}`}>
                            <span className="lang-vi">{item.title.vi}</span>
                            <span className="lang-en">{item.title.en}</span>
                            <span className="lang-km">{item.title.km ?? item.title.en}</span>
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-1">
                            <span className="text-muted text-[0.65rem]">
                              <span className="lang-vi">{kindLabel[item.kind].vi}</span>
                              <span className="lang-en">{kindLabel[item.kind].en}</span>
                              <span className="lang-km">{kindLabel[item.kind].en}</span>
                            </span>
                            {item.duration ? (
                              <span className="text-muted text-[0.65rem]">
                                · <span className="lang-vi">{item.duration.vi}</span>
                                <span className="lang-en">{item.duration.en}</span>
                                <span className="lang-km">{item.duration.km ?? item.duration.en}</span>
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
