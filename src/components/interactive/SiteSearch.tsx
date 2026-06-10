import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AiSearchHit, LocalSearchHit } from '../../types/search';
import { searchLocalDocuments } from '../../lib/search/localSearch';
import { loadSearchIndex, useSearchIndex } from '../../lib/search/useSearchIndex';
import { usePageLang } from '../../lib/usePageLang';

type SearchStatus = {
  aiSearchEnabled: boolean;
};

function useSearchStatus() {
  const [status, setStatus] = useState<SearchStatus>({ aiSearchEnabled: false });
  useEffect(() => {
    fetch('/api/search')
      .then((r) => r.json())
      .then((data) => setStatus({ aiSearchEnabled: Boolean(data.aiSearchEnabled) }))
      .catch(() => setStatus({ aiSearchEnabled: false }));
  }, []);
  return status;
}

function HitList({
  hits,
  lang,
  onNavigate,
}: {
  hits: Array<LocalSearchHit | AiSearchHit>;
  lang: 'vi' | 'en';
  onNavigate?: () => void;
}) {
  if (!hits.length) {
    return (
      <p className="text-muted px-1 py-6 text-center text-sm">
        <span className="lang-vi">Không có kết quả.</span>
        <span className="lang-en">No results.</span>
      </p>
    );
  }

  return (
    <ul className="max-h-[min(50vh,24rem)] space-y-1 overflow-y-auto">
      {hits.map((hit) => {
        const title = 'title' in hit && typeof hit.title === 'object' ? hit.title[lang] : hit.title;
        const description =
          'description' in hit
            ? hit.description[lang]
            : 'snippet' in hit
              ? hit.snippet
              : '';
        const category = 'category' in hit ? hit.category : 'AI Search';
        return (
          <li key={hit.id}>
            <a
              className="hover:bg-[var(--cf-surface-2)] block rounded-lg px-3 py-2.5 transition-colors"
              href={hit.href}
              onClick={onNavigate}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-snug">{title}</span>
                {category ? <span className="badge shrink-0 text-[10px]">{category}</span> : null}
              </div>
              {description ? <p className="text-muted mt-1 line-clamp-2 text-xs">{description}</p> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteSearch() {
  const lang = usePageLang();
  const { index } = useSearchIndex();
  const { aiSearchEnabled } = useSearchStatus();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [aiHits, setAiHits] = useState<AiSearchHit[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const localHits = useMemo(() => {
    if (!index || !query.trim()) return [];
    return searchLocalDocuments(index.documents, query, lang, 8);
  }, [index, query, lang]);

  const runAiSearch = useCallback(async () => {
    const q = query.trim();
    if (!q || !aiSearchEnabled) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q, lang, mode: 'ai' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAiHits([]);
        setAiError(data.message || (lang === 'en' ? 'AI Search failed.' : 'AI Search lỗi.'));
        return;
      }
      setAiHits((data.results ?? []) as AiSearchHit[]);
    } catch {
      setAiHits([]);
      setAiError(lang === 'en' ? 'AI Search failed.' : 'AI Search lỗi.');
    } finally {
      setAiLoading(false);
    }
  }, [query, lang, aiSearchEnabled]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      loadSearchIndex().catch(() => undefined);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
      setAiHits([]);
      setAiError(null);
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost inline-flex px-2.5 py-2 text-sm"
        onClick={() => setOpen(true)}
        aria-label={lang === 'en' ? 'Search' : 'Tìm kiếm'}
        title={lang === 'en' ? 'Search (Ctrl+K)' : 'Tìm kiếm (Ctrl+K)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        <span className="hidden lg:inline">
          <span className="lang-vi">Tìm kiếm</span>
          <span className="lang-en">Search</span>
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-2xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'en' ? 'Site search' : 'Tìm kiếm trang'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-[var(--cf-border)] pb-3">
              <input
                ref={inputRef}
                type="search"
                className="cf-input flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'en' ? 'DNS, WAF, Workers, Zero Trust…' : 'DNS, WAF, Workers, Zero Trust…'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiSearchEnabled) void runAiSearch();
                }}
              />
              <kbd className="text-muted hidden rounded border border-[var(--cf-border)] px-1.5 py-0.5 text-[10px] sm:inline">
                Esc
              </kbd>
            </div>

            {query.trim() ? (
              <div className="mt-3 space-y-4">
                <section>
                  <h3 className="text-muted mb-2 text-xs font-semibold uppercase tracking-wide">
                    <span className="lang-vi">Trang & thuật ngữ</span>
                    <span className="lang-en">Pages & glossary</span>
                  </h3>
                  <HitList hits={localHits} lang={lang} onNavigate={() => setOpen(false)} />
                </section>

                {aiSearchEnabled ? (
                  <section>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-muted text-xs font-semibold uppercase tracking-wide">
                        <span className="lang-vi">AI Search (Cloudflare)</span>
                        <span className="lang-en">AI Search (Cloudflare)</span>
                      </h3>
                      <button
                        type="button"
                        className="btn btn-secondary px-2 py-1 text-xs"
                        disabled={aiLoading || !query.trim()}
                        onClick={() => void runAiSearch()}
                      >
                        {aiLoading ? (
                          <>
                            <span className="lang-vi">Đang tìm…</span>
                            <span className="lang-en">Searching…</span>
                          </>
                        ) : (
                          <>
                            <span className="lang-vi">Tìm bằng AI</span>
                            <span className="lang-en">Search with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                    {aiError ? <p className="text-muted text-xs">{aiError}</p> : null}
                    {aiHits.length ? (
                      <HitList hits={aiHits} lang={lang} onNavigate={() => setOpen(false)} />
                    ) : null}
                  </section>
                ) : null}

                <p className="text-muted text-center text-xs">
                  <a className="link" href={`/search/?q=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)}>
                    <span className="lang-vi">Xem trang tìm kiếm đầy đủ</span>
                    <span className="lang-en">Open full search page</span>
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-muted mt-4 text-sm">
                <span className="lang-vi">Gõ từ khóa hoặc nhấn Ctrl+K bất cứ lúc nào.</span>
                <span className="lang-en">Type a keyword or press Ctrl+K anytime.</span>
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
