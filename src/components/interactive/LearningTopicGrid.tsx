import { useEffect, useMemo, useState } from 'react';
import type { LearningTopic } from '../../data/learningCenter';
import Pagination from '../ui/Pagination';

const PAGE_SIZE = 8;

type Props = {
  topics: LearningTopic[];
  pageSize?: number;
};

export default function LearningTopicGrid({ topics, pageSize = PAGE_SIZE }: Props) {
  const [track, setTrack] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (track === 'all') return topics;
    return topics.filter((t) => t.relatedTrack === track);
  }, [topics, track]);

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
        <select className="cf-input w-auto min-w-[160px]" value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="all">Track: All</option>
          <option value="application-services">Application Services</option>
          <option value="developer-platform">Developer Platform</option>
          <option value="cloudflare-one">Cloudflare One</option>
        </select>
        <span className="text-muted text-xs">
          <span className="lang-vi">
            {filtered.length} chủ đề · trang {page}/{totalPages}
          </span>
          <span className="lang-en">
            {filtered.length} topics · page {page}/{totalPages}
          </span>
        </span>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {paged.map((topic) => (
          <li key={topic.slug}>
            <article className="card flex h-full flex-col">
              <span className="badge badge-accent">{topic.category}</span>
              <h3 className="mt-3 text-lg font-semibold">
                <span className="lang-vi">{topic.title.vi}</span>
                <span className="lang-en">{topic.title.en}</span>
              </h3>
              <p className="text-muted mt-2 flex-1 text-sm">
                <span className="lang-vi">{topic.summary.vi}</span>
                <span className="lang-en">{topic.summary.en}</span>
              </p>
              <a
                className="link mt-3 text-sm"
                href={topic.officialPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lang-vi">Đọc trên Learning Center</span>
                <span className="lang-en">Read on Learning Center</span> ↗
              </a>
            </article>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
