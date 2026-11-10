#!/usr/bin/env node
/** Register any scaffolded blogPosts/*.ts exports missing from blog.ts */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src/data/blogPosts');
const blogTsPath = path.join(root, 'src/data/blog.ts');

const BLOG_POSTS_MARKER = 'export const blogPosts: BlogPost[] = [';
const BLOG_POSTS_CLOSER = '].sort(';

/**
 * Insert missing post exports into the blogPosts array that ends at `].sort(`.
 * The previous matcher stopped at the first `];`, which lives inside countBlogWords.
 *
 * @param {string} blogTs
 * @param {{ exportName: string, stem: string }[]} entries
 * @returns {string}
 */
export function applyScaffoldRegistration(blogTs, entries) {
  let next = blogTs;
  for (const entry of entries) {
    if (!entry?.exportName || !entry?.stem) continue;
    next = insertImport(next, entry);
    next = insertArrayEntry(next, entry.exportName);
  }
  return next;
}

/**
 * @param {string} blogTs
 * @param {{ exportName: string, stem: string }} entry
 */
function insertImport(blogTs, entry) {
  const importLine = `import { ${entry.exportName} } from './blogPosts/${entry.stem}';`;
  if (blogTs.includes(`from './blogPosts/${entry.stem}'`)) return blogTs;
  const imports = [...blogTs.matchAll(/^import .+$/gm)];
  const lastImport = imports.at(-1);
  const insertAt = lastImport ? lastImport.index + lastImport[0].length : 0;
  return blogTs.slice(0, insertAt) + `\n${importLine}` + blogTs.slice(insertAt);
}

/**
 * @param {string} blogTs
 * @param {string} exportName
 */
function insertArrayEntry(blogTs, exportName) {
  const located = locateBlogPostsArray(blogTs);
  if (arrayEntryNames(located.inner).includes(exportName)) return blogTs;
  const trimmed = located.inner.replace(/\s*$/, '');
  const withComma = trimmed.endsWith(',') ? trimmed : `${trimmed},`;
  const inner = `${withComma}\n  ${exportName},\n`;
  return blogTs.slice(0, located.innerStart) + inner + blogTs.slice(located.innerEnd);
}

/**
 * @param {string} blogTs
 * @returns {{ innerStart: number, innerEnd: number, inner: string }}
 */
export function locateBlogPostsArray(blogTs) {
  const start = blogTs.indexOf(BLOG_POSTS_MARKER);
  if (start < 0) {
    throw new Error('blog.ts is missing `export const blogPosts: BlogPost[] = [`');
  }
  const innerStart = start + BLOG_POSTS_MARKER.length;
  const closerAt = blogTs.indexOf(BLOG_POSTS_CLOSER, innerStart);
  if (closerAt < 0) {
    throw new Error(
      'blog.ts blogPosts array must close with `].sort(`. Refusing to insert at the first `];`.',
    );
  }
  return {
    innerStart,
    innerEnd: closerAt,
    inner: blogTs.slice(innerStart, closerAt),
  };
}

/** @param {string} inner */
export function arrayEntryNames(inner) {
  return inner
    .split('\n')
    .map((line) => line.trim().replace(/,$/, ''))
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(line));
}

/** @param {string} blogTs */
export function countBlogWordsSource(blogTs) {
  const match = blogTs.match(/export function countBlogWords[\s\S]*?\n\}/);
  return match ? match[0] : '';
}

/**
 * True when a post export was pasted into countBlogWords — the failure mode of
 * inserting at the first `];`.
 * @param {string} blogTs
 */
export function countBlogWordsIsCorrupted(blogTs) {
  return /\bpost[A-Z][A-Za-z0-9_]*\b/.test(countBlogWordsSource(blogTs));
}

function entriesFromDisk() {
  /** @type {{ exportName: string, stem: string }[]} */
  const entries = [];
  for (const fileName of readdirSync(postsDir)) {
    if (!fileName.endsWith('.ts')) continue;
    const stem = fileName.replace(/\.ts$/, '');
    const source = readFileSync(path.join(postsDir, fileName), 'utf8');
    const exportName = source.match(/export const (\w+)/)?.[1];
    if (!exportName) continue;
    entries.push({ exportName, stem });
  }
  return entries;
}

function main() {
  const before = readFileSync(blogTsPath, 'utf8');
  const after = applyScaffoldRegistration(before, entriesFromDisk());
  if (after === before) {
    console.log('blog.ts already up to date');
    return;
  }
  if (countBlogWordsSource(before) !== countBlogWordsSource(after)) {
    throw new Error('refusing to write blog.ts: countBlogWords would change');
  }
  writeFileSync(blogTsPath, after);
  console.log('Updated src/data/blog.ts imports');
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
