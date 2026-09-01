/** Protect HTML markup so machine translation cannot break tags or identifiers. */

const ANCHOR = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
const CODE_LIKE =
  /<(?:pre|code|kbd|samp)\b[^>]*>[\s\S]*?<\/(?:pre|code|kbd|samp)>/gi;
const STRONG = /<strong\b[^>]*>[\s\S]*?<\/strong>/gi;
const TAG = /<\/?[a-zA-Z][a-zA-Z0-9:-]*\b[^>]*>/g;

function stashAll(html, re, placeholders) {
  return html.replace(re, (match) => {
    const key = `#PH${placeholders.length}#`;
    placeholders.push({ key, value: match });
    return key;
  });
}

/** Replace markup with `#PHn#` tokens. Restore with `restoreMarkup`. */
export function protectMarkup(html) {
  const placeholders = [];
  let text = String(html ?? '');
  text = stashAll(text, CODE_LIKE, placeholders);
  text = stashAll(text, ANCHOR, placeholders);
  text = stashAll(text, STRONG, placeholders);
  text = stashAll(text, TAG, placeholders);
  return { text, placeholders };
}

export function restoreMarkup(translated, placeholders) {
  const byIndex = new Map(placeholders.map((p, i) => [String(i), p.value]));
  let out = String(translated ?? '');
  for (const { key, value } of placeholders) {
    out = out.split(key).join(value);
  }
  out = out.replace(/#\s*PH\s*(\d+)\s*#/g, (full, n) => byIndex.get(n) ?? full);
  return out;
}

export function markupValuesPresent(html, placeholders) {
  return placeholders.every(({ value }) => html.includes(value));
}

export function leftoverPlaceholderTokens(html) {
  return /#\s*PH\s*\d+\s*#|#\s*T\s*\d+_\d+\s*#/.test(html ?? '');
}

/** Split on sentence boundaries so m2m100 does not drop trailing placeholder clauses. */
export function splitSentences(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[.!?])\s+/);
  return parts.filter((p) => p.length);
}
