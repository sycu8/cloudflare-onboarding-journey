/**
 * Fill missing tutorial body translations (htmlVi / htmlKm / itemsVi / itemsKm).
 *
 * Usage:
 *   node scripts/fill-tutorial-overlays.mjs --lang=vi|km|both
 *   node scripts/fill-tutorial-overlays.mjs --lang=vi --only=/pages/tutorials/forms
 *   node scripts/fill-tutorial-overlays.mjs --report
 *   node scripts/fill-tutorial-overlays.mjs --force   # redo even if complete
 *
 * Env: TRANSLATE_PROVIDER=google|workers-ai|dry-run
 *      TRANSLATE_CONCURRENCY=6 (Workers AI parallel requests)
 *      CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID (workers-ai; auto-selected when token exists)
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { capitalizeHeading, translateEn } from './lib/translate-text.mjs';
import { sectionOverlayKey } from './lib/tutorial-overlay-key.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--') && !a.includes('=')));
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);
const langArg = args.find((a) => a.startsWith('--lang='))?.slice('--lang='.length) ?? 'both';
const langs = langArg === 'both' ? ['vi', 'km'] : [langArg];
const force = flags.has('--force');
const limitRaw = args.find((a) => a.startsWith('--limit='))?.slice('--limit='.length);
const limit = limitRaw ? Number(limitRaw) : Infinity;

const dataPath = join(root, 'src/data/tutorialPreviews.data.json');
const overlayPath = {
  vi: join(root, 'src/data/tutorialPreviews.vi.json'),
  km: join(root, 'src/data/tutorialPreviews.km.json'),
};

function loadJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

function saveJson(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function mapLimit(items, limit, fn) {
  const ret = [];
  let i = 0;
  const n = Math.max(1, Math.min(limit, items.length || 1));
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      ret[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: items.length ? n : 0 }, worker));
  return ret;
}

const concurrency = Number(process.env.TRANSLATE_CONCURRENCY ?? 6);

async function translateString(s, lang) {
  if (!s?.trim()) return s;
  return translateEn(s, lang);
}

async function translateStringArray(arr, lang) {
  if (!arr?.length) return arr;
  return mapLimit(arr, concurrency, (item) => translateString(item, lang));
}

function field(lang, viName, kmName) {
  return lang === 'vi' ? viName : kmName;
}

function overlayNeedsWork(entry, lang) {
  if (force) return true;
  if (!entry) return true;
  if (entry.complete) return false;
  return true;
}

function coverage(data, overlays) {
  const paths = Object.keys(data);
  let blocks = 0;
  let missingVi = 0;
  let missingKm = 0;
  for (const path of paths) {
    const preview = data[path];
    const vi = overlays.vi[path];
    const km = overlays.km[path];
    for (let i = 0; i < (preview.sections ?? []).length; i++) {
      const key = sectionOverlayKey(preview.sections, i);
      const section = preview.sections[i];
      for (let b = 0; b < section.blocks.length; b++) {
        const block = section.blocks[b];
        if (block.type === 'code') continue;
        blocks++;
        const viBlock = vi?.sections?.[key]?.blocks?.[b];
        const kmBlock = km?.sections?.[key]?.blocks?.[b];
        if (block.type === 'list') {
          if (!viBlock?.itemsVi?.length) missingVi++;
          if (!kmBlock?.itemsKm?.length) missingKm++;
        } else {
          if (!viBlock?.htmlVi) missingVi++;
          if (!kmBlock?.htmlKm) missingKm++;
        }
      }
    }
  }
  return {
    tutorials: paths.length,
    translatableBlocks: blocks,
    missingViBlocks: missingVi,
    missingKmBlocks: missingKm,
    viComplete: paths.filter((p) => overlays.vi[p]?.complete).length,
    kmComplete: paths.filter((p) => overlays.km[p]?.complete).length,
  };
}

async function fillTutorial(preview, lang) {
  const htmlField = field(lang, 'htmlVi', 'htmlKm');
  const itemsField = field(lang, 'itemsVi', 'itemsKm');
  const titleField = field(lang, 'titleVi', 'titleKm');
  const summaryField = field(lang, 'summaryVi', 'summaryKm');

  const entry = {
    [titleField]: preview.title ? capitalizeHeading(await translateString(preview.title, lang)) : undefined,
    [summaryField]: preview.summaryEn ? await translateString(preview.summaryEn, lang) : undefined,
    sections: {},
  };
  if (lang === 'km') {
    entry.introKm = preview.introEn ? await translateString(preview.introEn, lang) : undefined;
    entry.notesKm = preview.notesEn?.length ? await translateStringArray(preview.notesEn, lang) : undefined;
  }

  for (let i = 0; i < (preview.sections ?? []).length; i++) {
    const section = preview.sections[i];
    const key = sectionOverlayKey(preview.sections, i);
    const sec = {
      [titleField]: section.title ? capitalizeHeading(await translateString(section.title, lang)) : undefined,
      [summaryField]: section.summaryEn
        ? await translateString(section.summaryEn, lang)
        : undefined,
      blocks: [],
    };
    sec.blocks = await mapLimit(section.blocks, concurrency, async (block) => {
      if (block.type === 'code') return { type: 'code', skip: true };
      if (block.type === 'paragraph' || block.type === 'note') {
        return { type: block.type, [htmlField]: await translateString(block.html, lang) };
      }
      if (block.type === 'list') {
        return {
          type: 'list',
          ordered: block.ordered,
          [itemsField]: await translateStringArray(block.items, lang),
        };
      }
      return { type: block.type, skip: true };
    });
    entry.sections[key] = sec;
  }

  entry.complete = process.env.TRANSLATE_PROVIDER !== 'dry-run';
  return entry;
}

async function main() {
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  const overlays = {
    vi: loadJson(overlayPath.vi),
    km: loadJson(overlayPath.km),
  };

  if (flags.has('--report')) {
    console.log(JSON.stringify(coverage(data, overlays), null, 2));
    return;
  }

  const paths = Object.keys(data).filter((p) => !only || p.includes(only));
  for (const lang of langs) {
    if (lang !== 'vi' && lang !== 'km') {
      throw new Error(`Unsupported --lang=${lang}`);
    }
    let done = 0;
    for (const path of paths) {
      if (done >= limit) {
        console.log(`limit ${limit} reached for ${lang}`);
        break;
      }
      if (!overlayNeedsWork(overlays[lang][path], lang)) {
        console.log(`skip (${lang} done) ${path}`);
        continue;
      }
      console.log(`${lang} ${path}`);
      overlays[lang][path] = await fillTutorial(data[path], lang);
      saveJson(overlayPath[lang], overlays[lang]);
      done++;
      if (done % 3 === 0) {
        const complete = Object.values(overlays[lang]).filter((e) => e.complete).length;
        console.log(`checkpoint ${lang} ${complete}/${Object.keys(data).length}`);
      }
    }
    saveJson(overlayPath[lang], overlays[lang]);
    console.log(`Wrote ${overlayPath[lang]} (${paths.length} considered, ${done} updated)`);
  }

  console.log('coverage', coverage(data, overlays));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
