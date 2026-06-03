import { useEffect, useMemo, useState } from 'react';
import type { DiagramCategory, ReferenceDiagram } from '../../data/referenceDiagrams';
import { diagramCategoryLabels } from '../../data/referenceDiagrams';
import Pagination from '../ui/Pagination';

type CategoryFilter = 'all' | DiagramCategory;

const PAGE_SIZE = 9;

type Props = {
  diagrams: ReferenceDiagram[];
  pageSize?: number;
};

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

export default function ReferenceDiagramGrid({ diagrams, pageSize = PAGE_SIZE }: Props) {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(diagrams.map((d) => d.category));
    return [...set].sort() as DiagramCategory[];
  }, [diagrams]);

  const filtered = useMemo(() => {
    if (category === 'all') return diagrams;
    return diagrams.filter((d) => d.category === category);
  }, [diagrams, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          <span className="lang-vi">Chủ đề: </span>
          <span className="lang-en">Category: </span>
          <select
            className="cf-input ml-1 inline-block w-auto min-w-[180px]"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          >
            <option value="all">{lang === 'en' ? 'All categories' : 'Tất cả'}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(diagramCategoryLabels[cat], lang)}
              </option>
            ))}
          </select>
        </label>
        <span className="text-muted text-xs">
          <span className="lang-vi">
            {filtered.length} sơ đồ · trang {page}/{totalPages}
          </span>
          <span className="lang-en">
            {filtered.length} diagrams · page {page}/{totalPages}
          </span>
        </span>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paged.map((diagram) => (
          <li key={diagram.slug}>
            <article className="card flex h-full flex-col overflow-hidden p-0">
              <a
                href={diagram.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden border-b border-[var(--cf-border)] bg-[var(--cf-bg-elevated)]"
              >
                <img
                  src={diagram.primaryImageUrl}
                  alt={diagram.images[0]?.alt.en ?? diagram.title.en}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-full object-contain object-center p-2"
                />
              </a>
              <div className="flex flex-1 flex-col p-4">
                <span className="badge badge-accent w-fit text-xs">
                  {t(diagram.categoryLabel, lang)}
                </span>
                <h3 className="mt-2 text-base font-semibold leading-snug">{t(diagram.title, lang)}</h3>
                <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">{t(diagram.summary, lang)}</p>
                {diagram.concepts.length > 0 ? (
                  <p className="text-muted mt-2 text-xs">{diagram.concepts.slice(0, 4).join(' · ')}</p>
                ) : null}
                <a
                  className="btn btn-secondary mt-4 w-full justify-center"
                  href={diagram.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="lang-vi">Mở sơ đồ ↗</span>
                  <span className="lang-en">Open diagram ↗</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <Pagination className="mt-6" page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
