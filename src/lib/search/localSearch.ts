import type { LocalSearchHit, SearchDocument } from '../../types/search';

function tokenize(query: string) {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function scoreDocument(doc: SearchDocument, tokens: string[], lang: 'vi' | 'en') {
  const title = doc.title[lang].toLowerCase();
  const description = doc.description[lang].toLowerCase();
  const keywords = (doc.keywords ?? '').toLowerCase();
  const category = (doc.category ?? '').toLowerCase();
  const href = doc.href.toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += title.startsWith(token) ? 12 : 8;
    if (href.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
    if (keywords.includes(token)) score += 3;
    if (description.includes(token)) score += 2;
  }
  return score;
}

export function searchLocalDocuments(
  documents: SearchDocument[],
  query: string,
  lang: 'vi' | 'en',
  limit = 12,
): LocalSearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = tokenize(trimmed);
  if (!tokens.length) return [];

  return documents
    .map((doc) => ({ ...doc, score: scoreDocument(doc, tokens, lang) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title[lang].localeCompare(b.title[lang]))
    .slice(0, limit);
}
