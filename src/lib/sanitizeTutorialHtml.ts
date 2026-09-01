/** Escape raw tags inside <code> so set:html cannot break out of lang-* wrappers. */
export function sanitizeTutorialHtml(html: string): string {
  if (!html) return html;
  return html.replace(/<code\b([^>]*)>([\s\S]*?)<\/code>/gi, (_full, attrs: string, inner: string) => {
    const decoded = inner
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    const escaped = decoded
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    return `<code${attrs}>${escaped}</code>`;
  });
}

const CODE_RE = /<code\b([^>]*)>([\s\S]*?)<\/code>/gi;
const STRONG_RE = /<strong\b([^>]*)>([\s\S]*?)<\/strong>/gi;

type Mark = { attrs: string; inner: string };

function collectMarks(html: string, re: RegExp): Mark[] {
  const marks: Mark[] = [];
  const local = new RegExp(re.source, re.flags);
  html.replace(local, (_full, attrs: string, inner: string) => {
    marks.push({ attrs, inner });
    return _full;
  });
  return marks;
}

function replaceMarks(
  html: string,
  re: RegExp,
  tag: 'code' | 'strong',
  english: Mark[],
  shouldRestore: (en: Mark, translatedInner: string) => boolean,
): string {
  if (english.length === 0) return html;
  let i = 0;
  const local = new RegExp(re.source, re.flags);
  return html.replace(local, (full, attrs: string, inner: string) => {
    const en = english[i++];
    if (!en || !shouldRestore(en, inner)) return full;
    return `<${tag}${en.attrs || attrs}>${en.inner}</${tag}>`;
  });
}

/** Dashboard / docs UI labels: short, no sentence punctuation. */
function isEnglishUiLabel(inner: string): boolean {
  const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  if (!text || text.length > 48) return false;
  if (/[.!?]/.test(text)) return false;
  return /[A-Za-z]/.test(text);
}

/**
 * Copy English <code> (and short <strong> UI labels) into a translated overlay
 * so product identifiers stay English: action, form, public, Get started, etc.
 */
export function restoreEnglishTermsFromSource(translated: string, english: string): string {
  if (!translated || !english || translated === english) return translated;
  let next = replaceMarks(translated, CODE_RE, 'code', collectMarks(english, CODE_RE), () => true);
  next = replaceMarks(next, STRONG_RE, 'strong', collectMarks(english, STRONG_RE), (en, translatedInner) => {
    if (!isEnglishUiLabel(en.inner)) return false;
    return translatedInner !== en.inner;
  });
  return next;
}

/** Restore English identifiers, then escape code so lang wrappers cannot leak. */
export function prepareTutorialHtml(translated: string | undefined, english: string): string | undefined {
  if (!translated) return undefined;
  return sanitizeTutorialHtml(restoreEnglishTermsFromSource(translated, english));
}
