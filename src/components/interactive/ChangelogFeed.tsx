import { useEffect, useMemo, useState } from 'react';
import type { ChangelogEntry, ChangelogProduct } from '../../data/changelog';
import { changelogProductLabels } from '../../data/changelog';
import Pagination from '../ui/Pagination';

type ProductFilter = 'all' | ChangelogProduct;
type TrackFilter = ChangelogEntry['relatedTrack'] | 'all';

const PAGE_SIZE = 8;

type Props = {
  entries: ChangelogEntry[];
  pageSize?: number;
};

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

const trackLabels: Record<TrackFilter, { vi: string; en: string }> = {
  all: { vi: 'Mọi lộ trình', en: 'All tracks' },
  'application-services': { vi: 'Application Services', en: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  'cross-cutting': { vi: 'Chủ đề chung', en: 'Cross-cutting' },
};

export default function ChangelogFeed({ entries, pageSize = PAGE_SIZE }: Props) {
  const [product, setProduct] = useState<ProductFilter>('all');
  const [track, setTrack] = useState<TrackFilter>('all');
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (product !== 'all' && !e.products.includes(product)) return false;
      if (track !== 'all' && e.relatedTrack !== track) return false;
      return true;
    });
  }, [entries, product, track]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [product, track]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const productOptions = (Object.keys(changelogProductLabels) as ChangelogProduct[]).sort();

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          <span className="lang-vi">Sản phẩm: </span>
          <span className="lang-en">Product: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[160px]"
            value={product}
            onChange={(e) => setProduct(e.target.value as ProductFilter)}
          >
            <option value="all">{lang === 'en' ? 'All products' : 'Tất cả'}</option>
            {productOptions.map((key) => (
              <option key={key} value={key}>
                {t(changelogProductLabels[key], lang)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          <span className="lang-vi">Lộ trình hub: </span>
          <span className="lang-en">Hub track: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[180px]"
            value={track}
            onChange={(e) => setTrack(e.target.value as TrackFilter)}
          >
            {(Object.keys(trackLabels) as TrackFilter[]).map((key) => (
              <option key={key} value={key}>
                {t(trackLabels[key], lang)}
              </option>
            ))}
          </select>
        </label>
        <span className="text-muted text-xs">
          <span className="lang-vi">
            {filtered.length} mục · trang {page}/{totalPages}
          </span>
          <span className="lang-en">
            {filtered.length} entries · page {page}/{totalPages}
          </span>
        </span>
      </div>

      <ol className="space-y-4">
        {paged.map((entry) => (
          <li key={entry.id}>
            <article className="card">
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-muted text-xs font-medium tabular-nums" dateTime={entry.date}>
                  {entry.date}
                </time>
                {entry.productLabels.map((label) => (
                  <span key={label} className="badge">
                    {label}
                  </span>
                ))}
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug">
                <a className="link" href={entry.href} target="_blank" rel="noopener noreferrer">
                  {t(entry.title, lang)}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{t(entry.summary, lang)}</p>
              <p className="mt-3 text-xs">
                <a className="link" href={entry.href} target="_blank" rel="noopener noreferrer">
                  <span className="lang-vi">Đọc trên Developer Changelog ↗</span>
                  <span className="lang-en">Read on Developer Changelog ↗</span>
                </a>
              </p>
            </article>
          </li>
        ))}
      </ol>

      {filtered.length === 0 ? (
        <p className="text-muted mt-6 text-sm">
          <span className="lang-vi">Không có mục nào khớp bộ lọc.</span>
          <span className="lang-en">No entries match the current filters.</span>
        </p>
      ) : null}

      <Pagination className="mt-6" page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
