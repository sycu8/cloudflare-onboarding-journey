import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasKhmer, protectTerms, restoreTerms, sleep } from './km-glossary.mjs';
import { leftoverPlaceholderTokens, markupValuesPresent, protectMarkup, restoreMarkup, splitSentences } from './html-placeholders.mjs';

const cache = new Map();
const scriptsDir = dirname(fileURLToPath(import.meta.url));

function defaultProvider() {
  if (process.env.TRANSLATE_PROVIDER) return process.env.TRANSLATE_PROVIDER;
  if (process.env.CLOUDFLARE_API_TOKEN) return 'workers-ai';
  return 'google';
}

function getAccountId() {
  if (process.env.CLOUDFLARE_ACCOUNT_ID) return process.env.CLOUDFLARE_ACCOUNT_ID;
  try {
    const toml = readFileSync(join(scriptsDir, '../../wrangler.toml'), 'utf8');
    const m =
      toml.match(/CLOUDFLARE_ACCOUNT_ID\s*=\s*"([^"]+)"/) || toml.match(/account_id\s*=\s*"([^"]+)"/);
    return m?.[1];
  } catch {
    return undefined;
  }
}

export function hasVietnamese(text) {
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
    text ?? '',
  );
}

const WORKERS_AI_LANG = {
  vi: 'vietnamese',
  km: 'khmer',
};

/**
 * Translate English text to `vi` or `km`.
 * Env: TRANSLATE_PROVIDER=google|workers-ai|dry-run
 */
function shouldSkipMachineTranslate(text) {
  const plain = text.replace(/<[^>]+>/g, '').trim();
  if (plain.length <= 8 && /^[A-Za-z0-9._-]+$/.test(plain)) return true;
  if (/^(npm|npx|yarn|pnpm|bun|git|pip|cargo|go)\s+\S+$/i.test(plain)) return true;
  return false;
}

function isStutter(text) {
  const words = String(text).trim().split(/\s+/);
  if (words.length < 4) return false;
  const first = words[0];
  const same = words.filter((w) => w === first).length;
  return same / words.length >= 0.75;
}

function capitalizeHeading(text) {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase('vi') + text.slice(1);
}

export async function translateEn(text, targetLang, { provider = defaultProvider() } = {}) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (provider === 'dry-run') return text;
  if (shouldSkipMachineTranslate(trimmed)) return text;
  if (targetLang === 'km' && hasKhmer(trimmed)) return text;
  if (targetLang === 'vi' && hasVietnamese(trimmed) && !/[A-Za-z]{12,}/.test(trimmed)) return text;

  const cacheKey = `${targetLang}:${trimmed}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const markup = protectMarkup(trimmed);
  const { text: protectedText, placeholders: termPlaceholders } = protectTerms(markup.text);

  let translated;
  try {
    if (provider === 'workers-ai') {
      translated = await translateBySentences(protectedText, (chunk) => translateWorkersAi(chunk, targetLang));
    } else {
      translated = await translateBySentences(protectedText, (chunk) => translateGoogle(chunk, targetLang));
    }
  } catch (err) {
    console.warn('Translate failed:', trimmed.slice(0, 80).replace(/\s+/g, ' '), err.message);
    cache.set(cacheKey, trimmed);
    return text;
  }

  const restoredTerms = restoreTerms(translated, termPlaceholders);
  const restored = restoreMarkup(restoredTerms, markup.placeholders);
  if (leftoverPlaceholderTokens(restored) || !markupValuesPresent(restored, markup.placeholders)) {
    cache.set(cacheKey, trimmed);
    return text;
  }
  cache.set(cacheKey, restored);
  if (isStutter(restored) && !isStutter(trimmed)) {
    cache.set(cacheKey, trimmed);
    return text;
  }
  return restored;
}

export async function translateEnToKm(text, opts) {
  return translateEn(text, 'km', opts);
}

export async function translateEnToVi(text, opts) {
  return translateEn(text, 'vi', opts);
}

async function translateBySentences(text, translateChunk) {
  const parts = splitSentences(text);
  if (parts.length <= 1) return translateChunk(text);
  const out = [];
  for (const part of parts) {
    out.push(await translateChunk(part));
  }
  return out.join(' ');
}

async function translateGoogle(text, targetLang) {
  const chunks = chunkForTranslate(text, 1200);
  const out = [];
  for (const chunk of chunks) {
    out.push(await translateGoogleChunk(chunk, targetLang));
  }
  return out.join('');
}

async function translateGoogleChunk(text, targetLang) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetLang);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  let res;
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CloudflareStarterHub/1.0)',
        Accept: 'application/json',
      },
    });
    if (res.ok) break;
    if (res.status === 413 && text.length > 200) {
      const mid = Math.floor(text.length / 2);
      const split = text.lastIndexOf(' ', mid) > 0 ? text.lastIndexOf(' ', mid) : mid;
      const a = await translateGoogleChunk(text.slice(0, split), targetLang);
      const b = await translateGoogleChunk(text.slice(split), targetLang);
      return a + b;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(Math.min(8000, 700 * attempt) + Math.floor(Math.random() * 400));
      continue;
    }
    throw new Error(`Google translate HTTP ${res.status}`);
  }
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const data = await res.json();
  const parts = (data[0] ?? []).map((p) => p[0]).join('');
  if (!parts) throw new Error('Empty translation response');
  await sleep(140);
  return parts;
}

function chunkForTranslate(text, maxLen = 1200) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let rest = text;
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf('</p>', maxLen);
    if (cut < maxLen * 0.3) cut = rest.lastIndexOf('</li>', maxLen);
    if (cut < maxLen * 0.3) cut = rest.lastIndexOf('. ', maxLen);
    if (cut < maxLen * 0.3) cut = rest.lastIndexOf(' ', maxLen);
    if (cut <= 0) cut = maxLen;
    else {
      cut +=
        rest[cut] === ' '
          ? 1
          : rest.slice(cut, cut + 4) === '</p>'
            ? 4
            : rest.slice(cut, cut + 5) === '</li>'
              ? 5
              : 2;
    }
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function translateWorkersAi(text, targetLang) {
  const accountId = getAccountId();
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required for workers-ai');

  const chunks = chunkForTranslate(text, 900);
  const out = [];
  for (const chunk of chunks) {
    out.push(await translateWorkersAiChunk(chunk, targetLang, accountId, token));
  }
  return out.join('');
}

async function translateWorkersAiChunk(text, targetLang, accountId, token) {
  let res;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/m2m100-1.2b`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source_lang: 'english',
          target_lang: WORKERS_AI_LANG[targetLang] ?? targetLang,
        }),
      },
    );
    if (res.ok) break;
    if (res.status === 429 || res.status >= 500) {
      await sleep(Math.min(8000, 400 * attempt));
      continue;
    }
    throw new Error(`Workers AI HTTP ${res.status}: ${await res.text()}`);
  }
  if (!res.ok) throw new Error(`Workers AI HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const out = data?.result?.translated_text ?? data?.result?.response ?? '';
  if (!String(out).trim()) return text;
  await sleep(20);
  return out;
}

export async function translateBatch(strings, targetLang, opts = {}) {
  const out = [];
  for (const s of strings) {
    try {
      out.push(await translateEn(s, targetLang, opts));
    } catch (err) {
      console.warn('Translate failed:', String(s).slice(0, 60), err.message);
      out.push(s);
    }
  }
  return out;
}

export { hasKhmer, capitalizeHeading };
