import { useEffect, useMemo, useState } from 'react';
import type { AiSearchHit } from '../../types/search';
import { searchLocalDocuments } from '../../lib/search/localSearch';
import { useSearchIndex } from '../../lib/search/useSearchIndex';
import { usePageLang } from '../../lib/usePageLang';

function readInitialQuery() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
}

export default function SearchPage() {
  const lang = usePageLang();
  const { index, error } = useSearchIndex();
  const [query, setQuery] = useState(readInitialQuery);
  const [aiHits, setAiHits] = useState<AiSearchHit[]>([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const localHits = useMemo(() => {
    if (!index || !query.trim()) return [];
    return searchLocalDocuments(index.documents, query, lang, 20);
  }, [index, query, lang]);

  useEffect(() => {
    fetch('/api/search')
      .then((r) => r.json())
      .then((data) => setAiEnabled(Boolean(data.aiSearchEnabled)))
      .catch(() => setAiEnabled(false));
  }, []);

  useEffect(() => {
    const q = query.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    if (!q || !aiEnabled) {
      setAiHits([]);
      return;
    }

    const timer = window.setTimeout(() => {
      setAiLoading(true);
      setAiError(null);
      fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q, lang, mode: 'ai' }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.ok) {
            setAiHits([]);
            setAiError(data.message || null);
            return;
          }
          setAiHits((data.results ?? []) as AiSearchHit[]);
        })
        .catch(() => {
          setAiHits([]);
          setAiError(lang === 'en' ? 'AI Search failed.' : 'AI Search lỗi.');
        })
        .finally(() => setAiLoading(false));
    }, 450);

    return () => window.clearTimeout(timer);
  }, [query, lang, aiEnabled]);

  return (
    <div className="space-y-8">
      <label className="block">
        <span className="text-sm font-medium">
          <span className="lang-vi">Tìm kiếm</span>
          <span className="lang-en">Search</span>
        </span>
        <input
          className="cf-input mt-2"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'en' ? 'WAF, Pages, Zero Trust, D1…' : 'WAF, Pages, Zero Trust, D1…'}
          autoFocus
        />
      </label>

      {error ? (
        <p className="text-muted text-sm">
          <span className="lang-vi">Không tải được chỉ mục tìm kiếm.</span>
          <span className="lang-en">Could not load the search index.</span>
        </p>
      ) : null}

      {query.trim() ? (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              <span className="lang-vi">Kết quả nhanh</span>
              <span className="lang-en">Instant results</span>
              <span className="text-muted ml-2 text-sm font-normal">({localHits.length})</span>
            </h2>
            {localHits.length ? (
              <ul className="space-y-2">
                {localHits.map((hit) => (
                  <li key={hit.id} className="card">
                    <a className="block" href={hit.href}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">{hit.title[lang]}</span>
                        {hit.category ? <span className="badge">{hit.category}</span> : null}
                      </div>
                      <p className="text-muted mt-1 text-sm">{hit.description[lang]}</p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">
                <span className="lang-vi">Không có kết quả khớp từ khóa.</span>
                <span className="lang-en">No keyword matches.</span>
              </p>
            )}
          </section>

          {aiEnabled ? (
            <section className="space-y-3 border-t border-[var(--cf-border)] pt-8">
              <h2 className="text-lg font-semibold">
                <span className="lang-vi">AI Search (Cloudflare)</span>
                <span className="lang-en">AI Search (Cloudflare)</span>
              </h2>
              <p className="text-muted text-sm">
                <span className="lang-vi">Tìm kiếm ngữ nghĩa trên nội dung hub đã được index.</span>
                <span className="lang-en">Semantic search over indexed hub content.</span>
              </p>
              {aiLoading ? (
                <p className="text-muted text-sm">
                  <span className="lang-vi">Đang tìm bằng AI…</span>
                  <span className="lang-en">Searching with AI…</span>
                </p>
              ) : null}
              {aiError ? <p className="text-muted text-sm">{aiError}</p> : null}
              {aiHits.length ? (
                <ul className="space-y-2">
                  {aiHits.map((hit) => (
                    <li key={hit.id} className="card">
                      <a className="block" href={hit.href}>
                        <div className="font-medium">{hit.title}</div>
                        <p className="text-muted mt-1 text-sm">{hit.snippet}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : !aiLoading && !aiError ? (
                <p className="text-muted text-sm">
                  <span className="lang-vi">Chưa có kết quả AI.</span>
                  <span className="lang-en">No AI results yet.</span>
                </p>
              ) : null}
            </section>
          ) : (
            <p className="text-muted border-t border-[var(--cf-border)] pt-8 text-sm">
              <span className="lang-vi">
                AI Search chưa bật — xem <a className="link" href="https://developers.cloudflare.com/ai-search/">hướng dẫn Cloudflare</a> và{' '}
                <code>docs/AI-SEARCH-SETUP.md</code>.
              </span>
              <span className="lang-en">
                AI Search is not enabled — see <a className="link" href="https://developers.cloudflare.com/ai-search/">Cloudflare docs</a> and{' '}
                <code>docs/AI-SEARCH-SETUP.md</code>.
              </span>
            </p>
          )}
        </>
      ) : (
        <p className="text-muted text-sm">
          <span className="lang-vi">Nhập từ khóa để tìm trang, bài học, sản phẩm và thuật ngữ.</span>
          <span className="lang-en">Enter a keyword to find pages, lessons, products, and glossary terms.</span>
        </p>
      )}
    </div>
  );
}
