/**
 * Starlight-compatible heading anchors (matches developers.cloudflare.com).
 * @param {string} heading
 */
export function slugifyHeading(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/\\\./g, '.')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** @param {string} baseUrl @param {string} anchor */
export function buildDocSectionUrl(baseUrl, anchor) {
  const base = baseUrl.replace(/\/$/, '');
  if (!anchor || anchor === 'overview') return `${base}/`;
  return `${base}/#${anchor}`;
}
