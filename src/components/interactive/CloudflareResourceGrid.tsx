import { useEffect, useMemo, useState } from 'react';
import type {
  CloudflareResource,
  CloudflareResourceContentType,
  CloudflareResourceTrack,
} from '../../data/cloudflareResources';
import {
  cloudflareResourceContentTypeLabels,
  cloudflareResourceTrackLabels,
} from '../../data/cloudflareResources';
import {
  getTutorialHubPath,
  getTutorialPreviewForResource,
  getTutorialTitleForResource,
} from '../../data/tutorialPreviews';
import Pagination from '../ui/Pagination';

type TrackFilter = 'all' | CloudflareResourceTrack;
type TypeFilter = 'all' | CloudflareResourceContentType;

const PAGE_SIZE = 12;

type Props = {
  resources: CloudflareResource[];
  pageSize?: number;
  initialTrack?: TrackFilter;
};

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

export default function CloudflareResourceGrid({
  resources,
  pageSize = PAGE_SIZE,
  initialTrack = 'all',
}: Props) {
  const [track, setTrack] = useState<TrackFilter>(initialTrack);
  const [contentType, setContentType] = useState<TypeFilter>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('track');
    if (
      param === 'application-services' ||
      param === 'developer-platform' ||
      param === 'cloudflare-one'
    ) {
      setTrack(param);
    }
  }, []);

  const contentTypes = useMemo(() => {
    const set = new Set(resources.map((r) => r.contentType));
    return [...set].sort() as CloudflareResourceContentType[];
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (track !== 'all' && r.track !== track) return false;
      if (contentType !== 'all' && r.contentType !== contentType) return false;
      if (!q) return true;
      return `${r.title} ${r.path}`.toLowerCase().includes(q);
    });
  }, [resources, track, contentType, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [track, contentType, query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          <span className="lang-vi">Lộ trình: </span>
          <span className="lang-en">Track: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[160px]"
            value={track}
            onChange={(e) => setTrack(e.target.value as TrackFilter)}
          >
            <option value="all">{lang === 'en' ? 'All tracks' : 'Tất cả'}</option>
            {(Object.keys(cloudflareResourceTrackLabels) as CloudflareResourceTrack[]).map((tr) => (
              <option key={tr} value={tr}>
                {t(cloudflareResourceTrackLabels[tr], lang)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          <span className="lang-vi">Loại: </span>
          <span className="lang-en">Type: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[160px]"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as TypeFilter)}
          >
            <option value="all">{lang === 'en' ? 'All types' : 'Tất cả'}</option>
            {contentTypes.map((ct) => (
              <option key={ct} value={ct}>
                {t(cloudflareResourceContentTypeLabels[ct], lang)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium flex-1 min-w-[200px]">
          <span className="lang-vi">Tìm: </span>
          <span className="lang-en">Search: </span>
          <input
            className="cf-input ml-1 w-full max-w-xs"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'WAF, D1, Access…' : 'WAF, D1, Access…'}
          />
        </label>
        <span className="text-muted text-xs">
          {filtered.length} / {resources.length}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((r) => {
          const preview = getTutorialPreviewForResource(r);
          const hubPath = getTutorialHubPath(r);
          const isTutorialLike =
            r.contentType === 'Tutorial' || r.contentType === 'Solution guide';
          const summary =
            lang === 'vi' ? preview?.summaryVi : preview?.summaryEn ?? preview?.summaryVi;

          return (
            <article key={r.path} className="card flex h-full flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-accent text-xs">
                  {t(cloudflareResourceContentTypeLabels[r.contentType], lang)}
                </span>
                <span className="badge text-xs">{t(cloudflareResourceTrackLabels[r.track], lang)}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug">
                {isTutorialLike ? (
                  <a className="link" href={hubPath}>
                    <span className="lang-vi">{getTutorialTitleForResource(r, 'vi')}</span>
                    <span className="lang-en">{getTutorialTitleForResource(r, 'en')}</span>
                  </a>
                ) : (
                  r.title
                )}
              </h3>
              <p className="text-muted mt-2 flex-1 text-xs leading-relaxed opacity-90 line-clamp-3">
                {summary ?? r.path}
              </p>
              <a
                className="btn btn-primary mt-4 w-full justify-center text-sm"
                href={isTutorialLike ? hubPath : r.url}
                {...(!isTutorialLike ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {lang === 'en' ? 'Learn more' : 'Tìm hiểu thêm'}
              </a>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted mt-6 text-sm">
          <span className="lang-vi">Không có kết quả — thử bộ lọc khác.</span>
          <span className="lang-en">No results — try different filters.</span>
        </p>
      ) : null}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
    </div>
  );
}
