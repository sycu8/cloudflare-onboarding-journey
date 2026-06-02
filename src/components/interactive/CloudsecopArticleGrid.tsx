import { useEffect, useMemo, useState } from 'react';
import type { CloudsecopArticle } from '../../data/cloudsecop';
import { cloudsecopArticleUrl } from '../../data/cloudsecop';
import Pagination from '../ui/Pagination';

const PAGE_SIZE = 9;

type TrackFilter = CloudsecopArticle['relatedTrack'] | 'all';

type Props = {
  articles: CloudsecopArticle[];
  pageSize?: number;
};

const trackLabels: Record<TrackFilter, { vi: string; en: string }> = {
  all: { vi: 'Tất cả track', en: 'All tracks' },
  'application-services': { vi: 'Application Services', en: 'Application Services' },
  'developer-platform': { vi: 'Developer Platform', en: 'Developer Platform' },
  'cloudflare-one': { vi: 'Cloudflare One', en: 'Cloudflare One' },
  'cross-cutting': { vi: 'Chủ đề chung', en: 'Cross-cutting' },
};

export default function CloudsecopArticleGrid({ articles, pageSize = PAGE_SIZE }: Props) {
  const [track, setTrack] = useState<TrackFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (track === 'all') return articles;
    return articles.filter((a) => a.relatedTrack === track);
  }, [articles, track]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [track]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium">
          <span className="lang-vi">Lọc theo lộ trình: </span>
          <span className="lang-en">Filter by track: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[180px]"
            value={track}
            onChange={(e) => setTrack(e.target.value as TrackFilter)}
          >
            {(Object.keys(trackLabels) as TrackFilter[]).map((key) => (
              <option key={key} value={key}>
                {trackLabels[key].en}
              </option>
            ))}
          </select>
        </label>
        <span className="text-muted text-xs">
          <span className="lang-vi">
            {filtered.length} bài · trang {page}/{totalPages}
          </span>
          <span className="lang-en">
            {filtered.length} posts · page {page}/{totalPages}
          </span>
        </span>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paged.map((article) => (
          <li key={article.slug}>
            <article className="card flex h-full flex-col">
              <div className="flex flex-wrap items-center gap-2">
                {article.seriesPart ? (
                  <span className="badge badge-accent">
                    <span className="lang-vi">Phần {article.seriesPart}</span>
                    <span className="lang-en">Part {article.seriesPart}</span>
                  </span>
                ) : null}
                <span className="badge">
                  <span className="lang-vi">{article.readMinutes} phút đọc</span>
                  <span className="lang-en">{article.readMinutes} min read</span>
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-snug">
                <span className="lang-vi">{article.title.vi}</span>
                <span className="lang-en">{article.title.en}</span>
              </h3>
              <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                <span className="lang-vi">{article.excerpt.vi}</span>
                <span className="lang-en">{article.excerpt.en}</span>
              </p>
              {article.tags.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <li key={tag} className="badge text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              <a
                className="btn btn-secondary mt-4 w-full justify-center"
                href={cloudsecopArticleUrl(article.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lang-vi">Đọc trên CloudSecOp</span>
                <span className="lang-en">Read on CloudSecOp</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </article>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
