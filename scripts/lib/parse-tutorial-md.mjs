/**
 * Parse Cloudflare tutorial markdown (index.md) into structured preview fields.
 */
import { buildDocSectionUrl, slugifyHeading } from './docs-anchor.mjs';
import { extractLinksFromBlocks, parseBlocks } from './markdown-blocks.mjs';

/**
 * @typedef {{ type: 'paragraph' | 'note'; html: string } | { type: 'list'; ordered: boolean; items: string[] } | { type: 'code'; language: string; code: string }} TutorialContentBlock
 * @typedef {{ anchor: string; title: string; level: 2 | 3; blocks: TutorialContentBlock[]; docUrl: string; relatedLinks: Array<{ label: string; href: string }> }} TutorialSection
 */

/** @param {string} md @param {string} [baseUrl] */
export function parseTutorialMarkdown(md, baseUrl = '') {
  const fm = parseFrontmatter(md);
  const body = fm.body;

  const descriptionEn = cleanPlainText(fm.description || extractFirstParagraph(body) || '');
  const introEn = cleanPlainText(extractIntroParagraph(body) || descriptionEn);

  const beforeYouStart = extractSection(body, 'Before you start');
  const prerequisites = beforeYouStart
    ? splitListItems(beforeYouStart)
    : [];

  const sections = extractSections(body, baseUrl);
  const stepTitles = sections
    .filter((s) => s.level === 2 && /^\d+\./.test(s.title))
    .map((s) => s.title.replace(/^\d+\.\s*/, ''));

  const objectives = extractBulletObjectives(body);
  const lastReviewed = extractLastReviewed(body);

  return {
    titleEn: fm.title || '',
    descriptionEn: descriptionEn.trim(),
    introEn: introEn.trim(),
    prerequisites,
    stepTitles,
    objectives,
    lastReviewed,
    stepCount: stepTitles.length,
    sections,
  };
}

/** @param {string} body @param {string} baseUrl */
function extractSections(body, baseUrl) {
  let cleaned = body
    .replace(/^\[Skip to content\][^\n]*\n*/i, '')
    .replace(/^# [^\n]+\n+/m, '')
    .replace(/\*\*Last reviewed:\*\*[^\n]*/gi, '');

  /** @type {TutorialSection[]} */
  const sections = [];

  const firstH2 = cleaned.search(/\n## /);
  if (firstH2 > 0) {
    const intro = cleaned.slice(0, firstH2);
    const blocks = parseBlocks(intro);
    if (blocks.length) {
      sections.push({
        anchor: 'overview',
        title: 'Overview',
        level: 2,
        blocks,
        docUrl: buildDocSectionUrl(baseUrl, 'overview'),
        relatedLinks: extractLinksFromBlocks(blocks),
      });
    }
  }

  const tail = firstH2 >= 0 ? cleaned.slice(firstH2) : cleaned;
  const headingRe = /\n(#{2,3}) ([^\n]+)\n/g;
  /** @type {Array<{ level: number; title: string; start: number; contentStart: number }>} */
  const headings = [];
  let match;

  while ((match = headingRe.exec(tail))) {
    const level = match[1].length;
    const rawTitle = match[2].replace(/\\./g, '.').trim();
    const title = cleanPlainText(rawTitle);
    if (!title) continue;
    headings.push({
      level,
      title,
      start: match.index,
      contentStart: match.index + match[0].length,
    });
  }

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const end = i + 1 < headings.length ? headings[i + 1].start : tail.length;
    let content = tail.slice(h.contentStart, end);

    if (h.level === 2) {
      const subIdx = content.search(/\n### /);
      if (subIdx >= 0) {
        const beforeSubs = content.slice(0, subIdx);
        const parentBlocks = parseBlocks(beforeSubs);
        if (parentBlocks.length) {
          const anchor = slugifyHeading(h.title);
          sections.push(sectionFrom(h.title, h.level, anchor, parentBlocks, baseUrl));
        }
        content = content.slice(subIdx);
        const subRe = /\n### ([^\n]+)\n/g;
        let subMatch;
        while ((subMatch = subRe.exec(content))) {
          const subTitle = cleanPlainText(subMatch[1].replace(/\\./g, '.'));
          const subStart = subMatch.index + subMatch[0].length;
          const nextSub = content.slice(subStart).search(/\n### /);
          const subEnd = nextSub >= 0 ? subStart + nextSub : content.length;
          const subBlocks = parseBlocks(content.slice(subStart, subEnd));
          if (!subBlocks.length) continue;
          sections.push(sectionFrom(subTitle, 3, slugifyHeading(subTitle), subBlocks, baseUrl));
        }
        continue;
      }
    }

    const blocks = parseBlocks(content);
    if (!blocks.length) continue;
    sections.push(sectionFrom(h.title, h.level, slugifyHeading(h.title), blocks, baseUrl));
  }

  return sections.slice(0, 24);
}

/**
 * @param {string} title
 * @param {number} level
 * @param {string} anchor
 * @param {TutorialContentBlock[]} blocks
 * @param {string} baseUrl
 */
function sectionFrom(title, level, anchor, blocks, baseUrl) {
  return {
    anchor,
    title,
    level: /** @type {2 | 3} */ (level === 3 ? 3 : 2),
    blocks,
    docUrl: buildDocSectionUrl(baseUrl, anchor),
    relatedLinks: extractLinksFromBlocks(blocks),
  };
}

/** @param {string} md */
function parseFrontmatter(md) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { title: '', description: '', body: md };

  const raw = match[1];
  const body = match[2];
  const title = raw.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
  const description =
    raw.match(/^description:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';

  return { title, description, body };
}

/** @param {string} body */
function extractFirstParagraph(body) {
  const afterTitle = body.replace(/^#[^\n]+\n+/, '');
  const m = afterTitle.match(/^(?!>)([^\n#][^\n]+(?:\n(?![#>\-*\d])[^\n]+)*)/);
  return m?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
}

/** @param {string} body */
function extractIntroParagraph(body) {
  let text = body
    .replace(/^\[Skip to content\][^\n]*\n*/i, '')
    .replace(/^#[^\n]+\n+/m, '')
    .replace(/\*\*Last reviewed:\*\*[^\n]*/gi, '');

  const beforeSection = text.split(/\n## /)[0] ?? text;
  const lines = beforeSection
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith('>') &&
        !l.startsWith('#') &&
        !l.startsWith('![') &&
        !l.startsWith('[!') &&
        !/^Note$/i.test(l),
    );

  const para = cleanPlainText(lines.join(' '));
  return para.length > 40 ? para : '';
}

/** @param {string} body @param {string} heading */
function extractSection(body, heading) {
  const re = new RegExp(`## ${escapeReg(heading)}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const m = body.match(re);
  return m?.[1]?.trim() ?? '';
}

/** @param {string} text */
function splitListItems(text) {
  const items = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*[-*]\s+(.+)/);
    if (m) items.push(cleanPlainText(m[1]));
  }
  if (items.length) return items;
  const plain = cleanPlainText(text.replace(/\n+/g, ' ').trim());
  return plain ? [plain] : [];
}

/** @param {string} body */
function extractBulletObjectives(body) {
  const overview = extractSection(body, 'Overview') || extractSection(body, 'Objectives');
  if (!overview) return [];
  return splitListItems(overview).slice(0, 6);
}

/** @param {string} body */
function extractLastReviewed(body) {
  const m = body.match(/\*\*Last reviewed:\*\*\s*([^\n]+)/i);
  return m?.[1]?.trim() ?? '';
}

/** @param {string} s */
function cleanPlainText(s) {
  return s
    .replace(/\[Skip to content\][^\n]*/gi, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/\\\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {string} s */
function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
