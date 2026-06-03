/**
 * Production build with canonical PUBLIC_SITE_URL (sitemap, OG, agent discovery).
 */
import { spawnSync } from 'node:child_process';

const SITE = 'https://onboarding.orangecloud.vn';
process.env.PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL || SITE).replace(/\/$/, '');

const sitemapOnly = process.argv.includes('--sitemap-only');

const steps = [
  ['node', ['scripts/build-agent-discovery.mjs']],
  ['npx', ['astro', 'build']],
  ...(sitemapOnly ? [] : [['node', ['scripts/copy-dist-assets.mjs']]]),
];

for (const [cmd, args] of steps) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: true, env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`✓ Build complete (site: ${process.env.PUBLIC_SITE_URL})`);
