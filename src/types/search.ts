export type SearchDocument = {
  id: string;
  href: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  category?: string;
  keywords?: string;
};

export type LocalSearchHit = SearchDocument & {
  score: number;
};

export type AiSearchHit = {
  id: string;
  href: string;
  title: string;
  snippet: string;
  score: number;
  source?: string;
};

export type SearchIndexFile = {
  version: number;
  generatedAt: string;
  documents: SearchDocument[];
};
