/**
 * Crawl Cloudflare tutorial/solution-guide markdown and build hub preview JSON.
 * Usage: node scripts/crawl-tutorial-previews.mjs [--limit N] [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseTutorialMarkdown } from './lib/parse-tutorial-md.mjs';
import { generateTutorialPreviewVi, translateSectionTitleVi } from './lib/tutorial-preview-vi.mjs';

const CATALOG = 'src/data/cloudflareResources.data.json';
const OUT_JSON = 'src/data/tutorialPreviews.data.json';
const CACHE_DIR = 'scripts/cache/tutorials';
const DELAY_MS = 80;

const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : Infinity;
const FORCE = process.argv.includes('--force');
const REFETCH = process.argv.includes('--refetch');

/** @param {string} path */
function cachePath(path) {
  const safe = path.replace(/^\//, '').replace(/\//g, '__');
  return join(CACHE_DIR, `${safe}.md`);
}

/** @param {string} url */
async function fetchMarkdown(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'OrangeCloud-Learning-Hub/1.0 (tutorial-preview-sync)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const catalog = JSON.parse(readFileSync(CATALOG, 'utf8'));
  const targets = catalog.filter(
    (r) => r.contentType === 'Tutorial' || r.contentType === 'Solution guide',
  );
  const slice = Number.isFinite(LIMIT) ? targets.slice(0, LIMIT) : targets;

  mkdirSync(CACHE_DIR, { recursive: true });

  /** @type {Record<string, object>} */
  let existing = {};
  if (existsSync(OUT_JSON) && !FORCE) {
    try {
      existing = JSON.parse(readFileSync(OUT_JSON, 'utf8'));
    } catch {
      existing = {};
    }
  }

  /** @type {Record<string, object>} */
  const previews = { ...existing };
  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const resource of slice) {
    const key = resource.path;
    if (!FORCE && previews[key]?.crawledAt) {
      skipped++;
      continue;
    }

    const mdUrl = `https://developers.cloudflare.com${resource.path.replace(/\/$/, '')}/index.md`;
    const file = cachePath(resource.path);

    let md;
    try {
      if (!REFETCH && existsSync(file)) {
        md = readFileSync(file, 'utf8');
      } else {
        console.log('Fetch', mdUrl);
        md = await fetchMarkdown(mdUrl);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, md);
        fetched++;
        await sleep(DELAY_MS);
      }

      const officialUrl = resource.url.replace(/\/$/, '') + '/';
      const extracted = parseTutorialMarkdown(md, officialUrl);
      const vi = generateTutorialPreviewVi(resource, extracted);

      const sections = (extracted.sections ?? []).map((section, idx) => ({
        ...section,
        titleVi: translateSectionTitleVi(section.title),
        summaryVi: vi.sectionSummariesVi?.[idx] ?? '',
      }));

      previews[key] = {
        path: resource.path,
        slug: resource.slug,
        title: resource.title,
        titleVi: vi.titleVi || resource.title,
        url: officialUrl,
        contentType: resource.contentType,
        track: resource.track,
        summaryEn: extracted.descriptionEn || extracted.introEn,
        introEn: extracted.introEn,
        prerequisites: extracted.prerequisites,
        stepTitles: extracted.stepTitles,
        objectives: extracted.objectives,
        lastReviewed: extracted.lastReviewed,
        sections,
        summaryVi: vi.summaryVi,
        explanationVi: vi.explanationVi,
        notesVi: vi.notesVi,
        stepsVi: vi.stepsVi,
        estimatedMinutes: vi.estimatedMinutes,
        crawledAt: new Date().toISOString().slice(0, 10),
      };
    } catch (err) {
      failed++;
      console.warn('FAIL', resource.path, err instanceof Error ? err.message : err);
    }
  }

  writeFileSync(OUT_JSON, JSON.stringify(previews, null, 2));
  console.log(
    `Wrote ${Object.keys(previews).length} previews → ${OUT_JSON} (fetched ${fetched}, skipped ${skipped}, failed ${failed})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
