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
