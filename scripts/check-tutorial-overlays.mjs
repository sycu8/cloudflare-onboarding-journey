/**
 * Quality scan for tutorial language overlays.
 * Usage: node scripts/check-tutorial-overlays.mjs
 */
import { readFileSync, existsSync } from 'node:fs';

const data = JSON.parse(readFileSync('src/data/tutorialPreviews.data.json', 'utf8'));
const files = {
  vi: 'src/data/tutorialPreviews.vi.json',
  km: 'src/data/tutorialPreviews.km.json',
};

function isStutter(text) {
  const words = String(text).trim().split(/\s+/);
  if (words.length < 4) return false;
  return words.filter((w) => w === words[0]).length / words.length >= 0.75;
}

function walkBlocks(overlay, visit) {
  for (const [path, entry] of Object.entries(overlay)) {
    visit(path, 'title', entry.titleVi || entry.titleKm);
    visit(path, 'summary', entry.summaryVi || entry.summaryKm);
    for (const [key, section] of Object.entries(entry.sections || {})) {
      visit(path, `${key}.title`, section.titleVi || section.titleKm);
      for (const [i, block] of (section.blocks || []).entries()) {
        visit(path, `${key}#${i}`, block.htmlVi || block.htmlKm);
        for (const [j, item] of (block.itemsVi || block.itemsKm || []).entries()) {
          visit(path, `${key}#${i}.${j}`, item);
        }
      }
    }
  }
}

let failed = 0;
for (const [lang, file] of Object.entries(files)) {
  if (!existsSync(file)) {
    console.warn(`⚠ missing ${file}`);
    continue;
  }
  const overlay = JSON.parse(readFileSync(file, 'utf8'));
  let leftover = 0;
  let stutter = 0;
  const samples = [];
  walkBlocks(overlay, (path, where, text) => {
    if (!text) return;
    if (/#PH\d+#|#T\d+_\d+#/.test(text)) {
      leftover++;
      if (samples.length < 6) samples.push(`${lang} leftover ${path} ${where}`);
    }
    if (isStutter(text)) {
      stutter++;
      if (samples.length < 6) samples.push(`${lang} stutter ${path} ${where}: ${String(text).slice(0, 60)}`);
    }
  });
  const complete = Object.values(overlay).filter((e) => e.complete).length;
  console.log(
    `${lang}: ${complete}/${Object.keys(data).length} complete, leftover=${leftover}, stutter=${stutter}`,
  );
  for (const s of samples) console.log('  ', s);
  if (leftover) failed++;
}

if (failed) process.exit(1);
console.log('overlay quality scan passed');
