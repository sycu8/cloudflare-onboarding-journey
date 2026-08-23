import { hasKhmer, protectTerms, restoreTerms, sleep } from './km-glossary.mjs';

const cache = new Map();

/**
 * Translate English text to Khmer.
 * Uses Google Translate public endpoint when TRANSLATE_PROVIDER is unset or "google".
 * Set TRANSLATE_PROVIDER=dry-run to return English unchanged (for CI structure checks).
 */
export async function translateEnToKm(text, { provider = process.env.TRANSLATE_PROVIDER ?? 'google' } = {}) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  if (provider === 'dry-run') return text;
  if (cache.has(trimmed)) return cache.get(trimmed);

  const { text: protectedText, placeholders } = protectTerms(trimmed);

  let translated;
  if (provider === 'workers-ai') {
    translated = await translateWorkersAi(protectedText);
  } else {
    translated = await translateGoogle(protectedText);
  }

  const restored = restoreTerms(translated, placeholders);
  cache.set(trimmed, restored);
  return restored;
}

async function translateGoogle(text) {
  const chunks = chunkForTranslate(text, 1200);
  const out = [];
  for (const chunk of chunks) {
    out.push(await translateGoogleChunk(chunk));
  }
  return out.join('');
}

async function translateGoogleChunk(text) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', 'km');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 413 && text.length > 200) {
      const mid = Math.floor(text.length / 2);
      const split = text.lastIndexOf(' ', mid) > 0 ? text.lastIndexOf(' ', mid) : mid;
      const a = await translateGoogleChunk(text.slice(0, split));
      const b = await translateGoogleChunk(text.slice(split));
      return a + b;
    }
    throw new Error(`Google translate HTTP ${res.status}`);
  }
  const data = await res.json();
  const parts = (data[0] ?? []).map((p) => p[0]).join('');
  if (!parts) throw new Error('Empty translation response');
  await sleep(120);
  return parts;
}

/** Split long strings without breaking HTML tags when possible. */
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
    else cut += rest[cut] === ' ' ? 1 : (rest.slice(cut, cut + 4) === '</p>' ? 4 : rest.slice(cut, cut + 5) === '</li>' ? 5 : 2);
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function translateWorkersAi(text) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required for workers-ai');

  const res = await fetch(
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
        target_lang: 'khmer',
      }),
    },
  );
  if (!res.ok) throw new Error(`Workers AI HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const out = data?.result?.translated_text ?? data?.result?.response;
  if (!out) throw new Error('Workers AI empty response');
  await sleep(200);
  return out;
}

export async function translateBatch(strings, opts = {}) {
  const out = [];
  for (const s of strings) {
    try {
      out.push(await translateEnToKm(s, opts));
    } catch (err) {
      console.warn('Translate failed:', String(s).slice(0, 60), err.message);
      out.push(s);
    }
  }
  return out;
}

export { hasKhmer };
