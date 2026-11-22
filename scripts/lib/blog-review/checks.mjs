/**
 * Deterministic rubric checks. No network and no model: given a post, its
 * claims ledger and a filesystem view, return findings. Source quotes are
 * verified separately (sources.mjs) because that step needs the network.
 */
import path from 'node:path';
import {
  BILINGUAL,
  IMAGES,
  NUMERIC_CLAIM_RE,
  OUTDATED_SNIPPETS,
  PLACEHOLDER_PATTERNS,
  PRODUCT_NAME_RULES,
  SEO,
  STRUCTURE,
} from './rubric.mjs';
import { CLAIMS_LEDGER_SCHEMA, validate } from './schema.mjs';
import { isOfficialUrl } from './sources.mjs';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VI_DIACRITIC_RE = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
const VI_ONLY_RE = /[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;

/** @param {string} text */
export function countWords(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Every localized string in the post with a stable location id
 * (matches the claims ledger `location` pattern).
 * @param {any} post
 * @returns {{ location: string, value: Record<string, string> }[]}
 */
export function localizedFields(post) {
  const out = [];
  const push = (location, value) => {
    if (value && typeof value === 'object') out.push({ location, value });
  };
  push('title', post.title);
  push('description', post.description);
  push('excerpt', post.excerpt);
  push('keywords', post.keywords);
  (post.sections || []).forEach((section, si) => {
    push(`s${si}.heading`, section.heading);
    (section.paragraphs || []).forEach((p, pi) => push(`s${si}.p${pi}`, p));
    if (section.image) {
      push(`s${si}.image.alt`, section.image.alt);
      push(`s${si}.image.caption`, section.image.caption);
    }
  });
  (post.faq || []).forEach((item, fi) => {
    push(`faq${fi}.q`, item.question);
    push(`faq${fi}.a`, item.answer);
  });
  (post.images || []).forEach((image, ii) => {
    push(`image${ii}.alt`, image.alt);
    push(`image${ii}.caption`, image.caption);
  });
  (post.hubLinks || []).forEach((link, hi) => push(`hub${hi}.label`, link.label));
  return out;
}

/** Body text fields only (what readers read as prose). */
function proseFields(post) {
  return localizedFields(post).filter((f) => /^(title|description|excerpt|s\d+\.(heading|p\d+)|faq\d+\.[qa])$/.test(f.location));
}

/** @param {any} post @param {'vi'|'en'|'km'} lang */
export function postWordCount(post, lang) {
  return proseFields(post)
    .filter((f) => f.location !== 'excerpt')
    .reduce((sum, f) => sum + countWords(f.value[lang]), 0);
}

/** @param {any} post */
export function allImages(post) {
  const list = [];
  (post.sections || []).forEach((s, si) => {
    if (s.image) list.push({ image: s.image, location: `s${si}.image` });
  });
  (post.images || []).forEach((image, ii) => list.push({ image, location: `image${ii}` }));
  return list;
}

/**
 * @typedef {{ rule: string, category: string, severity: 'blocker'|'major'|'minor', message: string, location?: string, fix?: string }} Finding
 * @typedef {{
 *   diagramSlugs: Set<string>,
 *   postSlugs: Set<string>,
 *   fileSize: (publicPath: string) => number | null,
 *   readText: (publicPath: string) => string | null,
 *   today?: string,
 * }} CheckContext
 */

/**
 * @param {any} post
 * @param {any} ledger
 * @param {CheckContext} ctx
 * @returns {Finding[]}
 */
export function runDeterministicChecks(post, ledger, ctx) {
  /** @type {Finding[]} */
  const findings = [];
  const add = (rule, category, severity, message, location, fix) =>
    findings.push({ rule, category, severity, message, ...(location ? { location } : {}), ...(fix ? { fix } : {}) });

  const fields = localizedFields(post);
  const hasKm = fields.some((f) => typeof f.value.km === 'string' && f.value.km.trim());

  // ---------- FACTUAL (ledger shape; quotes are verified with the network) ----------
  const ledgerErrors = ledger ? validate(CLAIMS_LEDGER_SCHEMA, ledger) : ['claims ledger missing'];
  if (ledgerErrors.length) {
    add('FACT-001', 'factual', 'blocker', `Claims ledger invalid: ${ledgerErrors.slice(0, 5).join('; ')}`, undefined,
      'Write src/data/blogReviews/<slug>.claims.json with one entry per Cloudflare claim.');
  }
  const claims = Array.isArray(ledger?.claims) ? ledger.claims : [];
  if (ledger && ledger.slug !== post.slug) add('FACT-001', 'factual', 'blocker', 'Ledger slug does not match the post slug.');
  const knownLocations = new Set(fields.map((f) => f.location));
  const ids = new Set();
  for (const claim of claims) {
    if (ids.has(claim.id)) add('FACT-001', 'factual', 'blocker', `Duplicate claim id ${claim.id}.`);
    ids.add(claim.id);
    const loc = String(claim.location || '');
    const known = knownLocations.has(loc) || [...knownLocations].some((k) => k.startsWith(`${loc}.`));
    if (!known) add('FACT-001', 'factual', 'blocker', `Claim ${claim.id} points to missing location ${loc}.`, loc);
    if (!isOfficialUrl(claim.sourceUrl)) {
      add('FACT-002', 'factual', 'blocker', `Claim ${claim.id} cites a non-official source: ${claim.sourceUrl}`, loc,
        'Cite developers.cloudflare.com, cloudflare.com/plans, blog.cloudflare.com or the changelog.');
    }
  }
  const sourceHrefs = new Set((post.sources || []).map((s) => s.href));
  for (const claim of claims) {
    if (claim.sourceUrl && !sourceHrefs.has(claim.sourceUrl)) {
      add('FACT-003', 'factual', 'major', `Claim ${claim.id} source is not listed in post.sources.`, claim.location,
        'Add the URL to post.sources so readers can check it.');
    }
  }
  if (!(post.sources || []).length) add('FACT-002', 'factual', 'blocker', 'Post has no sources.');
  for (const [i, source] of (post.sources || []).entries()) {
    if (!isOfficialUrl(source.href)) {
      add('FACT-002', 'factual', 'blocker', `Source ${i} is not an official Cloudflare URL: ${source.href}`, `source${i}`);
    }
    if (!source.title || source.title === source.href) {
      add('SEO-006', 'seo', 'minor', `Source ${i} needs a human-readable title.`, `source${i}`);
    }
  }
  // Numbers, prices, limits, dates, plan names: the paragraph must carry a claim.
  const cited = new Set(claims.map((c) => String(c.location)));
  for (const f of proseFields(post)) {
    const hit = ['vi', 'en'].some((lang) => NUMERIC_CLAIM_RE.test(f.value[lang] || ''));
    if (hit && !cited.has(f.location)) {
      add('FACT-004', 'factual', 'blocker', 'States a number, limit, price, date or plan without a claim in the ledger.', f.location,
        'Add a ledger claim with a verbatim quote from an official page, or remove the figure.');
    }
  }

  // ---------- STRUCTURE ----------
  for (const lang of ['vi', 'en']) {
    const words = postWordCount(post, lang);
    if (words < STRUCTURE.minWordsPerLang) {
      add('STR-001', 'structure', 'blocker', `${lang.toUpperCase()} has ${words} words; minimum ${STRUCTURE.minWordsPerLang}.`);
    } else if (words > STRUCTURE.maxWordsPerLang) {
      add('STR-001', 'structure', 'major', `${lang.toUpperCase()} has ${words} words; maximum ${STRUCTURE.maxWordsPerLang}.`);
    }
  }
  if ((post.sections || []).length < STRUCTURE.minSections) {
    add('STR-002', 'structure', 'blocker', `Needs at least ${STRUCTURE.minSections} sections.`);
  }
  (post.sections || []).forEach((s, si) => {
    if (!(s.paragraphs || []).length) add('STR-002', 'structure', 'major', 'Section has no paragraphs.', `s${si}`);
    (s.paragraphs || []).forEach((p, pi) => {
      if (countWords(p.en) > STRUCTURE.maxParagraphWords) {
        add('STR-003', 'structure', 'minor', `Paragraph longer than ${STRUCTURE.maxParagraphWords} English words; split it.`, `s${si}.p${pi}`);
      }
    });
  });
  if ((post.faq || []).length < STRUCTURE.minFaq) add('STR-004', 'structure', 'major', `Needs at least ${STRUCTURE.minFaq} FAQ entries.`);
  const expectedMinutes = Math.max(1, Math.round(postWordCount(post, 'en') / STRUCTURE.wordsPerMinute));
  if (Math.abs((post.readingMinutes || 0) - expectedMinutes) > STRUCTURE.readingMinutesTolerance) {
    add('STR-005', 'structure', 'minor', `readingMinutes ${post.readingMinutes} is far from ~${expectedMinutes}.`);
  }
  for (const f of fields) {
    for (const lang of ['vi', 'en', 'km']) {
      const text = f.value[lang];
      if (typeof text !== 'string') continue;
      if (PLACEHOLDER_PATTERNS.some((re) => re.test(text))) {
        add('STR-006', 'structure', 'blocker', `Placeholder text left in ${lang}.`, f.location);
      }
    }
  }

  // ---------- BILINGUAL ----------
  for (const f of fields) {
    if (f.location === 'keywords') continue;
    for (const lang of ['vi', 'en']) {
      if (typeof f.value[lang] !== 'string' || !f.value[lang].trim()) {
        add('I18N-001', 'bilingual', 'blocker', `Missing ${lang} text.`, f.location);
      }
    }
    if (hasKm && (typeof f.value.km !== 'string' || !f.value.km.trim())) {
      add('I18N-002', 'bilingual', 'major', 'Post has Khmer text elsewhere; this field is missing km.', f.location);
    }
  }
  for (const f of proseFields(post)) {
    const vi = f.value.vi || '';
    const en = f.value.en || '';
    if (countWords(vi) >= 6 && !VI_DIACRITIC_RE.test(vi)) {
      add('I18N-003', 'bilingual', 'blocker', 'vi text has no Vietnamese diacritics (untranslated or stripped).', f.location);
    }
    if (VI_ONLY_RE.test(en.replace(/`[^`]*`/g, ''))) {
      add('I18N-004', 'bilingual', 'major', 'en text contains Vietnamese.', f.location);
    }
    if (/^s\d+\.p\d+$/.test(f.location) && countWords(en) >= 15) {
      const ratio = countWords(vi) / Math.max(1, countWords(en));
      if (ratio < BILINGUAL.minParagraphRatio || ratio > BILINGUAL.maxParagraphRatio) {
        add('I18N-005', 'bilingual', 'major', `vi/en length ratio ${ratio.toFixed(2)} suggests a missing or extra passage.`, f.location);
      }
    }
  }
  const overall = postWordCount(post, 'vi') / Math.max(1, postWordCount(post, 'en'));
  if (overall < BILINGUAL.minViEnRatio || overall > BILINGUAL.maxViEnRatio) {
    add('I18N-005', 'bilingual', 'major', `Overall vi/en word ratio ${overall.toFixed(2)} is outside ${BILINGUAL.minViEnRatio}–${BILINGUAL.maxViEnRatio}.`);
  }

  // ---------- SEO ----------
  if (!SLUG_RE.test(post.slug || '') || post.slug.length > SEO.slugMaxChars) {
    add('SEO-001', 'seo', 'blocker', `Slug must be lowercase-hyphenated and ≤ ${SEO.slugMaxChars} chars.`);
  }
  if (ctx.postSlugs.has(post.slug) && !ctx.allowExistingSlug) add('SEO-001', 'seo', 'blocker', 'Slug already used by a published post.');
  for (const lang of ['vi', 'en']) {
    const t = (post.title?.[lang] || '').length;
    if (t < SEO.titleChars.min || t > SEO.titleChars.max) {
      add('SEO-002', 'seo', 'major', `${lang} title is ${t} chars; keep ${SEO.titleChars.min}–${SEO.titleChars.max}.`, 'title');
    }
    const d = (post.description?.[lang] || '').length;
    if (d < SEO.descriptionChars.min || d > SEO.descriptionChars.max) {
      add('SEO-003', 'seo', 'major', `${lang} description is ${d} chars; keep ${SEO.descriptionChars.min}–${SEO.descriptionChars.max}.`, 'description');
    }
    const k = String(post.keywords?.[lang] || '').split(',').map((x) => x.trim()).filter(Boolean).length;
    if (k < SEO.keywordCount.min || k > SEO.keywordCount.max) {
      add('SEO-004', 'seo', 'minor', `${lang} has ${k} keywords; keep ${SEO.keywordCount.min}–${SEO.keywordCount.max}.`, 'keywords');
    }
  }
  const internal = (post.hubLinks || []).filter((l) => typeof l.href === 'string' && l.href.startsWith('/'));
  if (internal.length < SEO.minHubLinks) add('SEO-005', 'seo', 'major', `Needs at least ${SEO.minHubLinks} internal hub links.`);
  for (const rel of post.relatedPostSlugs || []) {
    if (!ctx.postSlugs.has(rel)) add('SEO-005', 'seo', 'major', `relatedPostSlugs has unknown post ${rel}.`);
  }

  // ---------- CODE ----------
  for (const f of proseFields(post)) {
    for (const lang of ['vi', 'en']) {
      const text = f.value[lang] || '';
      for (const rule of OUTDATED_SNIPPETS) {
        if (rule.re.test(text)) add('CODE-001', 'code', 'blocker', rule.message, f.location);
      }
      for (const m of text.matchAll(/compatibility_date\s*[=:]\s*"?(\d{4}-\d{2}-\d{2})/g)) {
        if (ctx.today && m[1] > ctx.today) add('CODE-002', 'code', 'blocker', `compatibility_date ${m[1]} is in the future.`, f.location);
      }
      const fences = text.match(/```/g);
      if (fences && fences.length % 2 === 1) add('CODE-003', 'code', 'major', 'Unclosed code fence.', f.location);
    }
  }
  for (const [i, block] of (post.codeSamples || []).entries()) {
    if (!block.lang || !block.code) add('CODE-003', 'code', 'major', 'Code sample needs lang and code.', `code${i}`);
    for (const rule of OUTDATED_SNIPPETS) {
      if (rule.re.test(block.code || '')) add('CODE-001', 'code', 'blocker', rule.message, `code${i}`);
    }
    if (block.lang === 'json' || block.lang === 'jsonc') {
      try {
        JSON.parse(String(block.code).replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));
      } catch {
        add('CODE-004', 'code', 'blocker', 'JSON sample does not parse.', `code${i}`);
      }
    }
  }

  // ---------- NAMING (counted under factual: a wrong product name is a factual error) ----------
  for (const f of fields) {
    for (const lang of ['vi', 'en']) {
      for (const rule of PRODUCT_NAME_RULES) {
        if (rule.re.test(f.value[lang] || '')) add('FACT-005', 'factual', 'blocker', rule.message, f.location);
      }
    }
  }

  // ---------- IMAGES ----------
  for (const { image, location } of allImages(post)) {
    const src = String(image.src || '');
    const ext = path.extname(src).toLowerCase();
    if (!IMAGES.allowedPrefixes.some((p) => src.startsWith(p))) {
      add('IMG-001', 'images', 'blocker', `Image must be committed under ${IMAGES.allowedPrefixes.join(' or ')} (no hotlinks).`, location);
      continue;
    }
    if (!IMAGES.allowedExtensions.includes(ext)) add('IMG-002', 'images', 'blocker', `Image format ${ext || '?'} not allowed.`, location);
    const size = ctx.fileSize(src);
    if (size == null) add('IMG-001', 'images', 'blocker', `Image file missing: public${src}`, location);
    else if (size > (ext === '.svg' ? IMAGES.maxSvgBytes : IMAGES.maxRasterBytes)) {
      add('IMG-003', 'images', 'major', `Image is ${Math.round(size / 1024)} KB; limit ${Math.round((ext === '.svg' ? IMAGES.maxSvgBytes : IMAGES.maxRasterBytes) / 1024)} KB.`, location);
    }
    for (const lang of hasKm ? ['vi', 'en', 'km'] : ['vi', 'en']) {
      const alt = String(image.alt?.[lang] || '').trim();
      if (alt.length < IMAGES.altChars.min || alt.length > IMAGES.altChars.max) {
        add('IMG-004', 'images', 'blocker', `${lang} alt text must be ${IMAGES.altChars.min}–${IMAGES.altChars.max} chars.`, location);
      } else if (alt.toLowerCase() === path.basename(src).toLowerCase() || /^(image|ảnh|hình|screenshot)\s*\d*$/i.test(alt)) {
        add('IMG-004', 'images', 'blocker', `${lang} alt text is not descriptive.`, location);
      }
    }
    const provenance = image.provenance;
    if (!src.startsWith('/ref-diagrams/') && !IMAGES.provenance.includes(provenance)) {
      add('IMG-005', 'images', 'blocker', `Image needs provenance (${IMAGES.provenance.join(', ')}).`, location);
    }
    const mentionsDashboard = /dashboard|bảng điều khiển|giao diện/i.test(`${image.alt?.en || ''} ${image.alt?.vi || ''} ${src}`);
    if (mentionsDashboard && provenance !== 'dashboard-capture' && provenance !== 'official-diagram') {
      add('IMG-006', 'images', 'blocker', 'Looks like a Cloudflare dashboard image but is not a real dashboard capture.', location,
        'Use a real screenshot (provenance dashboard-capture + credit) or remove it.');
    }
    if (provenance === 'dashboard-capture' && !(image.credit?.vi && image.credit?.en)) {
      add('IMG-007', 'images', 'major', 'Dashboard capture needs a credit line in vi and en.', location);
    }
    if (provenance === 'illustration' && !image.license) {
      add('IMG-008', 'images', 'blocker', 'Illustration needs a license field (own work, CC0, …).', location);
    }
  }

  // ---------- DIAGRAMS ----------
  const slugs = [...(post.diagramSlugs || []), ...(post.sections || []).map((s) => s.diagramSlug).filter(Boolean)];
  for (const slug of slugs) {
    if (!ctx.diagramSlugs.has(slug)) add('DIA-001', 'diagrams', 'blocker', `Unknown reference diagram slug ${slug}.`);
  }
  for (const { image, location } of allImages(post)) {
    if (path.extname(String(image.src || '')).toLowerCase() !== '.svg') continue;
    const svg = ctx.readText(image.src);
    if (svg == null) continue;
    if (/<script|on\w+\s*=|javascript:/i.test(svg)) add('DIA-002', 'diagrams', 'blocker', 'SVG contains script or event handlers.', location);
    if (!/viewBox=/.test(svg)) add('DIA-003', 'diagrams', 'major', 'SVG needs a viewBox so it scales.', location);
    if (!/<title>[^<]{3,}<\/title>/.test(svg)) add('DIA-003', 'diagrams', 'major', 'SVG needs a <title>.', location);
    const fontSizes = [...svg.matchAll(/font-size\s*[:=]\s*"?(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    if (fontSizes.some((n) => n < 11)) add('DIA-004', 'diagrams', 'major', 'SVG text below 11px is not legible.', location);
    for (const rule of PRODUCT_NAME_RULES) {
      if (rule.re.test(svg)) add('DIA-005', 'diagrams', 'blocker', `Diagram label: ${rule.message}`, location);
    }
    if (image.provenance === 'original-diagram') {
      const base = String(image.src).replace(/\.svg$/i, '');
      if (ctx.fileSize(`${base}.mmd`) == null && ctx.fileSize(`${base}.d2`) == null) {
        add('DIA-006', 'diagrams', 'minor', 'Commit the diagram source (.mmd or .d2) next to the SVG.', location);
      }
      // The figure has one src for every language, so labels must be language-neutral
      // (product names, arrows, icons). Explanations go in the localized caption.
      if (!image.labelsLanguageNeutral) {
        add('DIA-007', 'diagrams', 'major', 'Original diagram must use language-neutral labels (set labelsLanguageNeutral after checking) and explain steps in the vi/en caption.', location);
      }
      if (!(image.caption?.vi && image.caption?.en)) {
        add('DIA-008', 'diagrams', 'major', 'Original diagram needs a caption in vi and en describing the data flow.', location);
      }
    }
  }
  return findings;
}
