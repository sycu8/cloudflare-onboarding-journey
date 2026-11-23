/**
 * Official-source checks: host allow-list, page fetch, and verbatim quote
 * matching. A claim only counts as sourced when its quote is found in the
 * text this code fetched itself — a model can not vouch for a quote.
 */
import { OFFICIAL_SOURCE_HOSTS, OFFICIAL_WWW_PATH_PREFIXES } from './rubric.mjs';

/** @param {string} raw */
export function isOfficialUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (!OFFICIAL_SOURCE_HOSTS.includes(host)) return false;
  if (host === 'www.cloudflare.com' || host === 'cloudflare.com') {
    // Locale prefixes such as /vi-vn/plans/ are fine.
    const pathname = url.pathname.replace(/^\/[a-z]{2}-[a-z]{2}(?=\/)/i, '');
    return OFFICIAL_WWW_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  }
  return true;
}

/**
 * Collapse HTML/Markdown into comparable plain text: drop tags, scripts,
 * entities, markdown punctuation, smart quotes and whitespace differences.
 * @param {string} input
 */
export function normalizeText(input) {
  return String(input)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)\]])/g, '$1')
    .replace(/([(\[])\s+/g, '$1')
    .trim()
    .toLowerCase();
}

/**
 * @param {string} pageText already normalized or raw
 * @param {string} quote
 */
export function quoteFound(pageText, quote) {
  const q = normalizeText(quote);
  if (q.length < 20) return false;
  return normalizeText(pageText).includes(q);
}

/**
 * Plain text for prompts and sentence snapping. Tags and markdown markers
 * come out; sentence punctuation stays so a snapped quote is still verbatim
 * on the raw page after normalizeText.
 * @param {string} input
 */
export function extractPlainText(input) {
  return String(input)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[`*_>|]/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** @param {string} raw @returns {string[]} original sentences, verbatim-capable, ≥ 20 normalized chars */
export function pageSentences(raw) {
  const plain = extractPlainText(raw);
  const parts = plain.split(/(?<=[.!?])\s+|\n+/);
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const part of parts) {
    const text = part.replace(/\s+/g, ' ').trim();
    const norm = normalizeText(text);
    if (norm.length < 20 || seen.has(norm)) continue;
    seen.add(norm);
    out.push(text);
  }
  return out;
}

/** @param {string} text */
function wordTokens(text) {
  return normalizeText(text).split(/[^a-z0-9]+/).filter((word) => word.length > 2);
}

/** @param {string[]} a @param {string[]} b */
function dice(a, b) {
  if (!a.length || !b.length) return 0;
  const counts = new Map();
  for (const token of b) counts.set(token, (counts.get(token) || 0) + 1);
  let shared = 0;
  for (const token of a) {
    const n = counts.get(token) || 0;
    if (!n) continue;
    shared += 1;
    counts.set(token, n - 1);
  }
  return (2 * shared) / (a.length + b.length);
}

/** Share of needle words that appear in the sentence. Long docs sentences stay matchable. */
function coverage(needle, sentence) {
  if (!needle.length) return 0;
  const have = new Set(sentence);
  return needle.filter((token) => have.has(token)).length / needle.length;
}

/**
 * Closest sentence that already appears on the page. The returned text is
 * copied from the page, so quoteFound accepts it. Low scores return null.
 * @param {string} pageText
 * @param {string} needle
 * @returns {{ text: string, score: number } | null}
 */
export function closestVerbatimSentence(pageText, needle) {
  const sentences = pageSentences(pageText);
  const pieces = String(needle || '')
    .split('\n')
    .map((part) => part.trim())
    .filter((part) => part.length >= 8);
  const needles = pieces.length ? pieces : [String(needle || '')];
  /** @type {{ text: string, score: number } | null} */
  let best = null;
  for (const text of sentences) {
    const sentenceNorm = normalizeText(text);
    const sentenceTokens = wordTokens(text);
    let score = 0;
    for (const piece of needles) {
      const pieceNorm = normalizeText(piece);
      score = Math.max(score, dice(wordTokens(piece), sentenceTokens), coverage(wordTokens(piece), sentenceTokens));
      if (pieceNorm.length >= 12 && sentenceNorm.includes(pieceNorm)) {
        score = Math.max(score, 0.85 + pieceNorm.length / sentenceNorm.length);
      }
    }
    if (!best || score > best.score) best = { text, score };
  }
  if (!best || best.score < 0.55) return null;
  return best;
}

/**
 * One level of child docs linked from a fetched page, same folder only.
 * Skips images. Used so the generator sees limits and how-it-works pages,
 * not only the landing page.
 * @param {string} pageUrl
 * @param {string} raw
 * @param {number} [limit]
 */
export function discoverLinkedDocs(pageUrl, raw, limit = 4) {
  let base;
  try {
    base = new URL(pageUrl);
  } catch {
    return [];
  }
  if (base.hostname !== 'developers.cloudflare.com') return [];
  const folder = base.pathname.replace(/\/index\.md$/i, '/').replace(/\/[^/]*\.[a-z0-9]+$/i, '/');
  const prefix = folder.endsWith('/') ? folder : `${folder}/`;
  const seen = new Set([`${base.origin}${base.pathname}`.replace(/\/$/, '')]);
  /** @type {string[]} */
  const out = [];
  for (const match of String(raw).matchAll(/(?:https:\/\/developers\.cloudflare\.com)?(\/[a-z0-9./_-]+)/gi)) {
    const path = match[1].split(/[?#]/)[0];
    if (!path.startsWith(prefix) || path === prefix) continue;
    if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(path)) continue;
    const url = `https://${base.hostname}${path.endsWith('/') ? path : `${path}/`}`;
    const key = url.replace(/\/$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(url);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Prompt-sized plain passages. Prefer sentences over a raw HTML prefix.
 * @param {string} raw
 * @param {number} [maxChars]
 */
export function toPromptPassages(raw, maxChars = 12_000) {
  const lines = [];
  let used = 0;
  for (const sentence of pageSentences(raw)) {
    if (used + sentence.length > maxChars) break;
    lines.push(sentence);
    used += sentence.length + 1;
  }
  return lines.join('\n');
}

/**
 * developers.cloudflare.com serves a Markdown copy at <page>/index.md, which
 * is cleaner to match than the rendered HTML. Fall back to HTML.
 * @param {string} url
 */
export function candidateFetchUrls(url) {
  const u = new URL(url);
  u.hash = '';
  const list = [];
  if (u.hostname === 'developers.cloudflare.com' && !u.pathname.endsWith('.md')) {
    const md = new URL(u);
    md.pathname = `${u.pathname.replace(/\/?$/, '/')}index.md`;
    list.push(md.toString());
  }
  list.push(u.toString());
  return list;
}

/**
 * @param {(url: string) => Promise<{ status: number, text: string }>} fetcher
 * @returns {(url: string) => Promise<{ status: number | null, text: string }>}
 */
export function cachedSourceFetcher(fetcher) {
  const cache = new Map();
  return async (url) => {
    if (cache.has(url)) return cache.get(url);
    let result = { status: null, text: '' };
    if (isOfficialUrl(url)) {
      const parts = [];
      let status = null;
      for (const candidate of candidateFetchUrls(url)) {
        try {
          const res = await fetcher(candidate);
          if (status == null || res.status === 200) status = res.status;
          if (res.status === 200 && res.text) parts.push(res.text);
        } catch {
          /* network error → status stays null */
        }
      }
      result = { status, text: parts.join('\n') };
    }
    cache.set(url, result);
    return result;
  };
}

/** Real network fetcher with a timeout and a size cap. */
export async function httpFetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'orangecloud-blog-review/1.0 (+https://onboarding.orangecloud.vn)' },
    });
    // Redirects must stay on an official host.
    if (res.url && !isOfficialUrl(res.url)) {
      return { status: 0, text: '' };
    }
    const text = res.ok ? (await res.text()).slice(0, 2_000_000) : '';
    return { status: res.status, text };
  } finally {
    clearTimeout(timer);
  }
}
