/**
 * Machine-readable blog quality rubric. docs/blog/RUBRIC.md explains every
 * rule; this file is the single source of the numbers the reviewer enforces.
 * Change a threshold here and in RUBRIC.md in the same PR.
 */

export const RUBRIC_VERSION = '2026-11-22.1';

/** Every category must reach its threshold. Factual accuracy is all-or-nothing. */
export const CATEGORY_THRESHOLDS = {
  factual: 100,
  structure: 80,
  bilingual: 80,
  seo: 80,
  code: 90,
  images: 90,
  diagrams: 90,
};

export const OVERALL_MIN = 85;

/** Score deduction per finding. A blocker fails the category outright. */
export const SEVERITY_PENALTY = { blocker: 100, major: 25, minor: 10 };

export const MAX_REVIEW_ROUNDS_DEFAULT = 3;

/** Only these hosts count as official Cloudflare sources for a claim. */
export const OFFICIAL_SOURCE_HOSTS = [
  'developers.cloudflare.com',
  'www.cloudflare.com',
  'cloudflare.com',
  'blog.cloudflare.com',
];

/** Paths on www.cloudflare.com that are allowed (plans, pricing, legal, learning). */
export const OFFICIAL_WWW_PATH_PREFIXES = [
  '/plans',
  '/application-services/products',
  '/developer-platform',
  '/zero-trust',
  '/learning',
  '/trust-hub',
  '/service-specific-terms',
  '/terms',
  '/press-releases',
  '/pg-cloudflare-one',
  '/network',
  '/ai-security',
  '/products',
  '/lp',
];

export const STRUCTURE = {
  minWordsPerLang: 400,
  maxWordsPerLang: 2200,
  minSections: 3,
  maxParagraphWords: 140,
  minFaq: 3,
  readingMinutesTolerance: 3,
  wordsPerMinute: 200,
};

export const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /lorem ipsum/i,
  /^\s*Sample question\?\s*$/i,
  /^\s*Câu hỏi mẫu\?\s*$/i,
  /\(TODO:/i,
  /\[\[.*?\]\]/,
  /\bFIXME\b/i,
];

export const BILINGUAL = {
  /** vi words / en words over the whole post (Vietnamese is syllable-split, so usually > 1). */
  minViEnRatio: 0.8,
  maxViEnRatio: 2.2,
  /** Per paragraph, looser, to catch a missing or truncated translation. */
  minParagraphRatio: 0.45,
  maxParagraphRatio: 3.2,
};

export const SEO = {
  titleChars: { min: 20, max: 80 },
  descriptionChars: { min: 70, max: 200 },
  keywordCount: { min: 3, max: 10 },
  slugMaxChars: 70,
  minHubLinks: 2,
};

export const IMAGES = {
  allowedExtensions: ['.webp', '.avif', '.png', '.jpg', '.jpeg', '.svg'],
  maxRasterBytes: 300 * 1024,
  maxSvgBytes: 150 * 1024,
  altChars: { min: 8, max: 160 },
  allowedPrefixes: ['/images/blog/', '/ref-diagrams/'],
  provenance: ['dashboard-capture', 'official-diagram', 'original-diagram', 'illustration'],
};

/**
 * Snippet patterns that are outdated or wrong for current Wrangler.
 * Sources: developers.cloudflare.com/workers/wrangler/configuration/ and
 * developers.cloudflare.com/workers/static-assets/ (checked 2026-11-22).
 */
export const OUTDATED_SNIPPETS = [
  { re: /\bnode_compat\s*=/, message: '`node_compat` is legacy; use compatibility_flags = ["nodejs_compat"].' },
  { re: /\busage_model\s*=/, message: '`usage_model` is no longer a Wrangler setting.' },
  { re: /^\s*type\s*=\s*"(?:webpack|javascript|rust)"/m, message: 'Wrangler v1 `type` key is not valid config.' },
  { re: /\[site\]|"site"\s*:\s*\{/, message: 'Workers Sites `[site]` is superseded by Workers Static Assets (`assets`).' },
  { re: /\bwrangler\s+publish\b/, message: 'Use `wrangler deploy`, not `wrangler publish`.' },
  { re: /\bwrangler\s+generate\b/, message: 'Use `npm create cloudflare@latest`, not `wrangler generate`.' },
  { re: /\baddEventListener\(\s*['"]fetch['"]/, message: 'Service-worker syntax; use ES module `export default { fetch }`.' },
];

/** Exact casing for names that are often mistyped. */
export const PRODUCT_NAME_RULES = [
  { re: /\bCloudFlare\b/, message: 'Write "Cloudflare", not "CloudFlare".' },
  { re: /\bcloud flare\b/i, message: 'Write "Cloudflare", not "cloud flare".' },
  { re: /\bWorker KV\b/, message: 'Product name is "Workers KV".' },
  { re: /\bWorkers AI Gateway\b/, message: 'Product name is "AI Gateway".' },
  { re: /\bCloudflare R2 Storage\b/, message: 'Product name is "R2" (or "Cloudflare R2").' },
  { re: /\bZero-Trust\b/, message: 'Write "Zero Trust".' },
];

/** Sentences with these tokens state a number/limit/price/date and must be cited. */
export const NUMERIC_CLAIM_RE =
  /(\$\s?\d|\d+(?:[.,]\d+)?\s?(?:%|ms|giây|seconds?|s\b|phút|minutes?|giờ|hours?|ngày|days?|MB|GB|TB|KB|MiB|GiB|requests?|yêu cầu|req|RPS|USD|đô)|\b(?:19|20)\d{2}-\d{2}-\d{2}\b|\b(?:miễn phí|free tier|Free plan|gói Free)\b)/i;

export const CATEGORIES = Object.keys(CATEGORY_THRESHOLDS);
