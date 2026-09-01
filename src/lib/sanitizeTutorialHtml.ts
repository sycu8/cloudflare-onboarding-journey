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
