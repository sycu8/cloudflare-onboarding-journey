/**
 * Verify trilingual content is present in built HTML (vi / en / km).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const checks = [
  {
    file: 'content-roadmap/index.html',
    en: ['Why it matters', 'The Internet is a global network'],
    km: ['Internet គឺជាបណ្តាញ', 'រួចរាល់'],
    viOnly: ['Mạng Internet là mạng lưới toàn cầu'],
  },
  {
    file: 'roadmaps/sales/index.html',
    en: ['connectivity layer'],
    km: ['connectivity layer'],
    viOnly: [],
  },
  {
    file: 'tutorials/workers/tutorials/build-a-qr-code-generator/index.html',
    en: ['QR code'],
    km: [],
    viOnly: [],
  },
];

let failed = 0;
for (const { file, en, km, viOnly } of checks) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    console.error(`✗ missing ${file}`);
    failed++;
    continue;
  }
  const html = readFileSync(path, 'utf8');
  for (const phrase of en) {
    if (!html.includes(phrase)) {
      console.error(`✗ ${file} missing EN: "${phrase}"`);
      failed++;
    } else {
      console.log(`✓ ${file} has EN "${phrase.slice(0, 40)}..."`);
    }
  }
  for (const phrase of km) {
    if (!html.includes(phrase)) {
      console.warn(`⚠ ${file} missing KM (optional until overlay filled): "${phrase}"`);
    } else {
      console.log(`✓ ${file} has KM "${phrase.slice(0, 40)}..."`);
    }
  }
  for (const phrase of viOnly) {
    if (html.includes(`lang-en">${phrase}`)) {
      console.error(`✗ ${file} VI leaked into lang-en: "${phrase}"`);
      failed++;
    }
  }
}

const json = JSON.parse(readFileSync('src/data/tutorialPreviews.data.json', 'utf8'));
const missingNotes = Object.values(json).filter((p) => p.notesVi?.length && !p.notesEn?.length).length;
if (missingNotes) {
  console.error(`✗ ${missingNotes} tutorials missing notesEn`);
  failed++;
} else {
  console.log(`✓ all ${Object.keys(json).length} tutorials have notesEn`);
}

const kmJsonPath = 'src/data/tutorialPreviews.km.json';
if (existsSync(kmJsonPath)) {
  const kmJson = JSON.parse(readFileSync(kmJsonPath, 'utf8'));
  const kmCount = Object.keys(kmJson).length;
  console.log(`✓ tutorialPreviews.km.json has ${kmCount} entries (source: ${Object.keys(json).length})`);
  if (kmCount < Object.keys(json).length) {
    console.warn(`⚠ ${Object.keys(json).length - kmCount} tutorials still need Khmer overlay`);
  }
} else {
  console.warn('⚠ tutorialPreviews.km.json missing');
}

const topicsEn = readFileSync('src/data/roleRoadmaps/stepTopicsEn.ts', 'utf8');
const topicCount = (topicsEn.match(/'[a-z]+-week-\d+'/g) || []).length;
if (topicCount !== 29) {
  console.error(`✗ stepTopicsEn has ${topicCount} entries, expected 29`);
  failed++;
} else {
  console.log('✓ 29 role week topic EN overlays');
}

const topicsKm = readFileSync('src/data/roleRoadmaps/stepTopicsKm.ts', 'utf8');
const topicKmCount = (topicsKm.match(/'[a-z]+-week-\d+'/g) || []).length;
if (topicKmCount !== 29) {
  console.error(`✗ stepTopicsKm has ${topicKmCount} entries, expected 29`);
  failed++;
} else {
  console.log('✓ 29 role week topic KM overlays');
}

const topicKmFile = readFileSync('src/data/contentRoadmap/topicKm.ts', 'utf8');
const topicKmKeys = (topicKmFile.match(/'[a-z0-9-]+':/g) || []).length;
if (topicKmKeys < 88) {
  console.error(`✗ topicKm.ts has ${topicKmKeys} entries, expected 88`);
  failed++;
} else {
  console.log(`✓ ${topicKmKeys} content roadmap topic KM overlays`);
}

if (failed) process.exit(1);
console.log('\nAll i18n checks passed.\n');
