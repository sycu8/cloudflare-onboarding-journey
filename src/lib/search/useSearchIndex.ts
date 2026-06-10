import { useEffect, useState } from 'react';
import type { SearchIndexFile } from '../../types/search';

let cache: SearchIndexFile | null = null;
let inflight: Promise<SearchIndexFile> | null = null;

export function loadSearchIndex() {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch('/search-index.json')
    .then((r) => {
      if (!r.ok) throw new Error('search_index_unavailable');
      return r.json() as Promise<SearchIndexFile>;
    })
    .then((data) => {
      cache = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useSearchIndex() {
  const [index, setIndex] = useState<SearchIndexFile | null>(cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cache) return;
    loadSearchIndex()
      .then(setIndex)
      .catch(() => setError(true));
  }, []);

  return { index, error };
}
