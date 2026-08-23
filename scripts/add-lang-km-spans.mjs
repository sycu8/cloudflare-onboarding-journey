/**
 * Adds .lang-km spans after .lang-en spans missing a paired .lang-km sibling.
 * Also adds km fields to inline { vi, en } objects when missing.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'src');

const STATIC_KM = {
  Done: 'រួចរាល់',
  Foundation: 'មូលដ្ឋាន',
  Beginner: 'អ្នកចាប់ផ្តើម',
  Intermediate: 'កម្រិតមធ្យម',
  'General knowledge': 'ចំណេះទូទៅ',
  'Why it matters': 'ហេតុអ្វីសំខាន់',
  Prerequisites: 'តម្រូវការជាមុន',
  'Related Cloudflare products': 'ផលិតផល Cloudflare ពាក់ព័ន្ធ',
  'On this hub': 'នៅលើ hub',
  'Suggested tutorials': 'Tutorial ណែនាំ',
  'Suggested exercise': 'លំហាត់ណែនាំ',
  'Common newbie mistakes': 'កំហុសថ្មីៗញឹកញាប់',
  Sources: 'ប្រភព',
  'Mark as complete': 'សម្គាល់ថារួច',
  Complete: 'រួចរាល់',
  Topics: 'ប្រធានបទ',
  'Hub links': 'តំណ hub',
  'Suggested deployment tutorials': 'Tutorial deploy ណែនាំ',
  'Recommended products': 'ផលិតផលណែនាំ',
  Exercises: 'លំហាត់',
  'Week outcome': 'លទ្ធផលសប្តាហ៍',
  'Mark week complete': 'សម្គាល់សប្តាហ៍រួច',
  'From zero': 'ចាប់ផ្តើមពីសូន្យ',
  Basic: 'មូលដ្ឋាន',
  Technical: 'បច្ចេកទេស',
  Mixed: 'ចម្រុះ',
  Duration: 'រយៈពេល',
  'Starting level': 'កម្រិតចាប់ផ្តើម',
  'Primary track': 'Track ចម្បង',
  Outcome: 'លទ្ធផល',
  'View roadmap': 'មើល roadmap',
  'Learning progress': 'វឌ្ឍនភាពសិក្សា',
  Reset: 'Reset',
  'Progress overview': 'ទិដ្ឋភាពវឌ្ឍនភាព',
  'Export JSON': 'Export JSON',
  'Content Roadmap': 'Content Roadmap',
  'Active role roadmap': 'Roadmap តួនាទីសកម្ម',
  'Progress by role': 'វឌ្ឍនភាពតាមតួនាទី',
  'Continue learning': 'បន្តសិក្សា',
  'Roadmap progress': 'វឌ្ឍនភាព roadmap',
  'Start this roadmap': 'ចាប់ផ្តើម roadmap',
  Continue: 'បន្ត',
  Glossary: 'Glossary',
  Checklist: 'Checklist',
  Quiz: 'Quiz',
  Stage: 'ដំណាក់កាល',
  'After this stage you will': 'បន្ទាប់ពីដំណាក់កាលនេះ',
  'Role-based roadmaps': 'Roadmap តាមតួនាទី',
  'Keep learning': 'បន្តសិក្សា',
  'Final outcome': 'លទ្ធផលចុងក្រោយ',
  'Built by': 'Built by',
  'Hosted on Cloudflare Pages': 'Hosted on Cloudflare Pages',
};

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!name.includes('node_modules')) walk(p, files);
    } else if (['.astro', '.tsx'].includes(extname(p))) {
      files.push(p);
    }
  }
  return files;
}

function toKmExpression(expr) {
  let e = expr.trim();
  if (/\bKm\b/.test(e)) return e;

  // fooEn ?? fooVi (same prefix)
  e = e.replace(
    /([\w.?[\]'"]+)\.(\w+)En(\s*\?\?\s*\1\.\2Vi)/g,
    '$1.$2Km$3 ?? $1.$2En$3',
  );

  // fooEn?.[i] ?? bar
  e = e.replace(
    /([\w.]+)\.(\w+)En\?\.(\[[^\]]+\])\s*\?\?\s*/g,
    '$1.$2Km?.$3 ?? $1.$2En?.$3 ?? ',
  );

  // label.en (LocalizedString)
  if (/^(\w+)\.en$/.test(e)) {
    const m = e.match(/^(\w+)\.en$/);
    return `${m[1]}.km ?? ${m[1]}.en`;
  }

  // t.titleEn
  if (/^(\w+)\.titleEn$/.test(e)) {
    const m = e.match(/^(\w+)\.titleEn$/);
    return `${m[1]}.titleKm ?? ${m[1]}.titleEn`;
  }

  // getContentTopicTitle(id, 'en')
  if (/getContentTopicTitle\(([^,]+),\s*'en'\)/.test(e)) {
    const m = e.match(/getContentTopicTitle\(([^,]+),\s*'en'\)/);
    return `getContentTopicTitle(${m[1]}, 'km') ?? getContentTopicTitle(${m[1]}, 'en')`;
  }

  // getTutorialDisplayTitle(preview, 'en')
  if (/getTutorialDisplayTitle\(([^,]+),\s*'en'\)/.test(e)) {
    const m = e.match(/getTutorialDisplayTitle\(([^,]+),\s*'en'\)/);
    return `getTutorialDisplayTitle(${m[1]}, 'km') ?? getTutorialDisplayTitle(${m[1]}, 'en')`;
  }

  return e;
}

function staticKm(text) {
  const trimmed = text.trim();
  if (STATIC_KM[trimmed]) return STATIC_KM[trimmed];
  return trimmed;
}

function addKmSpans(src) {
  const spanRe =
    /(<span (?:class|className)="[^"]*\blang-en\b[^"]*">)([\s\S]*?)(<\/span>)(?!\s*\n?\s*<span (?:class|className)="[^"]*\blang-km\b)/g;

  return src.replace(spanRe, (full, open, inner, close, offset) => {
    const lineStart = src.lastIndexOf('\n', offset) + 1;
    const indent = src.slice(lineStart, offset).match(/^(\s*)/)?.[1] ?? '      ';

    const trimmed = inner.trim();
    let kmInner;

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const expr = trimmed.slice(1, -1);
      kmInner = `{${toKmExpression(expr)}}`;
    } else {
      kmInner = staticKm(trimmed);
    }

    const openAttrs = open.replace(/\blang-en\b/g, 'lang-km');
    return `${open}${inner}${close}\n${indent}${openAttrs}${kmInner}${close}`;
  });
}

function addKmToInlineObjects(src) {
  // Single-line { vi: '...', en: '...' } without km
  return src.replace(
    /\{\s*vi:\s*('(?:\\'|[^'])*'|"(?:\\"|[^"])*")([^}]*?)en:\s*('(?:\\'|[^'])*'|"(?:\\"|[^"])*")(\s*)\}/g,
    (match, viPart, middle, enPart, tail) => {
      if (/\bkm\s*:/.test(match)) return match;
      const enVal = enPart.slice(1, -1);
      const kmVal = STATIC_KM[enVal] ?? enVal;
      const kmQuote = enPart[0];
      const escaped = kmVal.replace(/\\/g, '\\\\').replace(new RegExp(kmQuote, 'g'), `\\${kmQuote}`);
      return `{ vi: ${viPart}${middle}en: ${enPart}, km: ${kmQuote}${escaped}${kmQuote}${tail}}`;
    },
  );
}

function addKmToLevelLabels(src) {
  const labelMap = {
    Foundation: 'មូលដ្ឋាន',
    Beginner: 'អ្នកចាប់ផ្តើម',
    Intermediate: 'កម្រិតមធ្យម',
    'From zero': 'ចាប់ផ្តើមពីសូន្យ',
    Basic: 'មូលដ្ឋាន',
    Technical: 'បច្ចេកទេស',
    Mixed: 'ចម្រុះ',
  };

  return src.replace(
    /(\w+:\s*\{\s*vi:\s*'[^']*',\s*en:\s*'([^']*)'\s*\})/g,
    (match, full, enVal) => {
      if (/km:/.test(match)) return match;
      const km = labelMap[enVal] ?? enVal;
      return full.replace(/\}\s*$/, `, km: '${km}' }`);
    },
  );
}

let updated = 0;
for (const file of walk(root)) {
  let src = readFileSync(file, 'utf8');
  if (!src.includes('lang-en')) continue;

  const orig = src;
  src = addKmToLevelLabels(src);
  src = addKmToInlineObjects(src);
  src = addKmSpans(src);

  if (src !== orig) {
    writeFileSync(file, src, 'utf8');
    updated++;
    console.log('updated', file.replace(root, ''));
  }
}
console.log(`Done. ${updated} files updated.`);
