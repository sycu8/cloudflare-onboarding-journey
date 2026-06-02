import { useEffect, useMemo, useState } from 'react';
import type { GlossaryTerm } from '../../data/glossary';
import Pagination from '../ui/Pagination';

const PAGE_SIZE = 12;

type Props = { terms: GlossaryTerm[] };

export default function GlossarySearch({ terms }: Props) {
  const [q, setQ] = useState('');
  const [track, setTrack] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return terms.filter((t) => {
      if (track !== 'all' && t.relatedTrack !== track) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (!query) return true;
      return (
        t.term.toLowerCase().includes(query) ||
        t.definition.vi.toLowerCase().includes(query) ||
        t.definition.en.toLowerCase().includes(query)
      );
    });
  }, [terms, q, track, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [q, track, category]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const categories = useMemo(() => Array.from(new Set(terms.map((t) => t.category))), [terms]);

  return (
    <div>
      <div className="card space-y-3">
        <label className="block text-sm font-medium">
          <span className="lang-vi">Tìm kiếm</span>
          <span className="lang-en">Search</span>
          <input
            className="cf-input mt-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="DNS, WAF, Zero Trust…"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <select className="cf-input w-auto min-w-[140px]" value={track} onChange={(e) => setTrack(e.target.value)}>
            <option value="all">Track: All</option>
            <option value="application-services">Application Services</option>
            <option value="developer-platform">Developer Platform</option>
            <option value="cloudflare-one">Cloudflare One</option>
          </select>
          <select className="cf-input w-auto min-w-[140px]" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Category: All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="text-muted text-xs">
          <span className="lang-vi">
            {filtered.length} thuật ngữ · trang {page}/{totalPages}
          </span>
          <span className="lang-en">
            {filtered.length} terms · page {page}/{totalPages}
          </span>
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-4 text-center text-sm">
          <span className="lang-vi">Không tìm thấy thuật ngữ.</span>
          <span className="lang-en">No terms found.</span>
        </div>
      ) : (
        <>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {paged.map((t) => (
              <li key={t.term} className="card">
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-accent">{t.term}</span>
                  <span className="badge">{t.category}</span>
                </div>
                <p className="text-muted mt-3 text-sm">
                  <span className="lang-vi">{t.definition.vi}</span>
                  <span className="lang-en">{t.definition.en}</span>
                </p>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
