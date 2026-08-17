#!/usr/bin/env node
/** Register any scaffolded blogPosts/*.ts exports missing from blog.ts */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src/data/blogPosts');
const blogTsPath = path.join(root, 'src/data/blog.ts');
let blogTs = readFileSync(blogTsPath, 'utf8');
let changed = false;

for (const f of readdirSync(postsDir)) {
  if (!f.endsWith('.ts')) continue;
  const stem = f.replace(/\.ts$/, '');
  const t = readFileSync(path.join(postsDir, f), 'utf8');
  const exp = t.match(/export const (\w+)/)?.[1];
  if (!exp) continue;
  if (!blogTs.includes(`from './blogPosts/${stem}'`)) {
    const lastImport = [...blogTs.matchAll(/^import .+$/gm)].at(-1);
    const insertAt = lastImport ? lastImport.index + lastImport[0].length : 0;
    blogTs =
      blogTs.slice(0, insertAt) +
      `\nimport { ${exp} } from './blogPosts/${stem}';` +
      blogTs.slice(insertAt);
    changed = true;
  }
  if (!new RegExp(`\\b${exp}\\b`).test(blogTs.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/)?.[1] || '')) {
    blogTs = blogTs.replace(
      /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/,
      (_m, inner) => {
        const trimmed = inner.trim().replace(/,\s*$/, '');
        return `export const blogPosts: BlogPost[] = [\n  ${trimmed},\n  ${exp},\n];`;
      },
    );
    changed = true;
  }
}

if (changed) {
  writeFileSync(blogTsPath, blogTs);
  console.log('Updated src/data/blog.ts imports');
} else {
  console.log('blog.ts already up to date');
}
