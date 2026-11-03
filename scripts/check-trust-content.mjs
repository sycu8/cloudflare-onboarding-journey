/**
 * Fails the build if removed personal details, paid-success pricing, or non-public source labels reappear.
 * Incident links in built HTML must stay on www.cloudflarestatus.com/incidents/.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const distOnly = process.argv.includes('--dist');
const roots = distOnly ? [join(root, 'dist')] : [root];
const skipDir = new Set(['node_modules', '.git', 'dist', '.astro', 'coverage']);
const textExt = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.json', '.txt', '.md', '.html', '.svg', '.xml', '.css']);

const phrases = [
  'Cường Lê Sỹ',
  'Lê Sỹ Cường',
  'Cuong Le Sy',
  'Le Sy Cuong',
  'Mr. Cường',
  'Cuong Le',
  '0369 161 494',
  '0369161494',
  '0773 288 148',
  '0773288148',
  'Premium Success',
  'SOLMKT',
  'internal training',
  'internal comparison',
  'tài liệu đào tạo nội bộ',
  'so sánh nội bộ',
  'new.cloudflarestatus.com',
];

const self = 'scripts/check-trust-content.mjs';
const failures = [];

function walk(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const path = join(dir, name);
    const rel = relative(root, path);
    if (!distOnly && (rel === self || rel.startsWith('scripts/test-cloudflare-status'))) continue;
    let st;
    try {
      st = statSync(path);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (!distOnly && skipDir.has(name)) continue;
      walk(path);
      continue;
    }
    const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
    if (!textExt.has(ext) && ext !== '.xml') continue;
    if (st.size > 8_000_000) continue;
    const text = readFileSync(path, 'utf8');
    for (const phrase of phrases) {
      if (text.includes(phrase)) failures.push(`${rel} contains ${JSON.stringify(phrase)}`);
    }
    if (/\bACV\b/.test(text)) failures.push(`${rel} contains "ACV"`);
    if (distOnly) {
      const links = text.match(/https?:\/\/[^"'\s]*cloudflarestatus\.com[^"'\s]*/gi) ?? [];
      for (const link of links) {
        const clean = link
          .replace(/\\+$/g, '')
          .replace(/&quot;.*$/i, '')
          .replace(/[),.;]+$/, '');
        const allowed =
          /^https:\/\/www\.cloudflarestatus\.com\/?$/.test(clean) ||
          clean.startsWith('https://www.cloudflarestatus.com/incidents/') ||
          clean.startsWith('https://www.cloudflarestatus.com/history') ||
          clean.startsWith('https://www.cloudflarestatus.com/api/');
        if (!allowed) failures.push(`${rel} has status link ${clean}`);
      }
    }
  }
}

for (const dir of roots) walk(dir);

if (failures.length) {
  console.error(failures.slice(0, 40).join('\n'));
  console.error(`✗ trust check failed (${failures.length})`);
  process.exit(1);
}

console.log(`✓ trust check (${distOnly ? 'dist' : 'source'})`);
