/**
 * Parse tutorial markdown into renderable blocks with preserved links.
 */

const CF_ORIGIN = 'https://developers.cloudflare.com';
const SKIP_LINE =
  /^(npm|yarn|pnpm|bun|jsonc|toml|markdown|bash|sh|shell|powershell|txt|javascript|typescript|ts|js|python|go|rust|hcl)$/i;

/** @param {string} text */
function isJunkContent(text) {
  const t = text.replace(/<[^>]+>/g, ' ').trim();
  return (
    !t ||
    /skip to content/i.test(t) ||
    /llms\.txt/i.test(t) ||
    /Fetch the complete documentation index/i.test(t) ||
    /Documentation Index/i.test(t) ||
    /tab-panel/i.test(t) ||
    /^Note$/i.test(t)
  );
}

/** @param {string} md */
export function parseBlocks(md) {
  /** @type {import('./parse-tutorial-md.mjs').TutorialContentBlock[]} */
  const blocks = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ') || line.startsWith('## ')) {
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join('\n').trim();
      if (code) blocks.push({ type: 'code', language: lang || 'text', code: code.slice(0, 4000) });
      i++;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(parseInlineMd(lines[i].replace(/^[-*]\s+/, '')));
        i++;
      }
      if (items.length) blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(parseInlineMd(lines[i].replace(/^\d+\.\s+/, '')));
        i++;
      }
      if (items.length) blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith('![') || /^>\s*Documentation Index/i.test(line)) {
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      const noteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        noteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const html = parseInlineMd(noteLines.join(' '));
      if (html && !isJunkContent(html)) blocks.push({ type: 'note', html });
      continue;
    }

    if (line.startsWith('* [') && line.includes('](#tab-panel')) {
      i++;
      continue;
    }

    if (SKIP_LINE.test(line.trim()) && i + 1 < lines.length && lines[i + 1].startsWith('```')) {
      i++;
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('![')
    ) {
      if (SKIP_LINE.test(lines[i].trim()) && i + 1 < lines.length && lines[i + 1].startsWith('```')) break;
      paraLines.push(lines[i]);
      i++;
    }

    const html = parseInlineMd(paraLines.join(' '));
    if (html && !isJunkContent(html)) blocks.push({ type: 'paragraph', html });
    if (paraLines.length === 0) i++;
  }

  return blocks.slice(0, 48);
}

/** @param {string} text */
export function parseInlineMd(text) {
  if (!text?.trim()) return '';

  let s = escapeHtml(text.trim());

  s = s.replace(/`([^`]+)`/g, '<code class="tutorial-inline-code">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em>$1</em>');

  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const url = normalizeUrl(href);
    const ext = url.startsWith('http') && !url.includes('developers.cloudflare.com');
    const attrs = ext
      ? ' target="_blank" rel="noopener noreferrer"'
      : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${escapeHtml(url)}" class="link"${attrs}>${label}</a>`;
  });

  return s.replace(/\s+/g, ' ').trim();
}

/** @param {string} href */
function normalizeUrl(href) {
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (href.startsWith('/')) return `${CF_ORIGIN}${href}`;
  if (href.startsWith('#')) return href;
  return href;
}

/** @param {string} s */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {import('./parse-tutorial-md.mjs').TutorialContentBlock[]} blocks */
export function extractLinksFromBlocks(blocks) {
  /** @type {Array<{ label: string; href: string }>} */
  const links = [];
  const seen = new Set();

  for (const block of blocks) {
    const sources =
      block.type === 'list'
        ? block.items
        : block.type === 'paragraph' || block.type === 'note'
          ? [block.html]
          : [];

    for (const src of sources) {
      const re = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
      let m;
      while ((m = re.exec(src))) {
        const href = m[1];
        if (!href.includes('developers.cloudflare.com') && !href.startsWith('/')) continue;
        const full = href.startsWith('/') ? `${CF_ORIGIN}${href}` : href;
        const key = full.split('#')[0];
        if (seen.has(key)) continue;
        seen.add(key);
        links.push({ label: m[2], href: full });
        if (links.length >= 8) return links;
      }
    }
  }
  return links;
}
