#!/usr/bin/env node
/**
 * Wait until a Cloudflare Pages deployment serves core HTML routes.
 * Usage: node scripts/wait-for-deploy.mjs <baseUrl> [path ...]
 */
const base = (process.argv[2] || '').replace(/\/$/, '');
const paths = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ['/', '/start-here', '/blog/', '/products'];

if (!base) {
  console.error('Usage: node scripts/wait-for-deploy.mjs <baseUrl> [path ...]');
  process.exit(2);
}

const maxAttempts = Number(process.env.DEPLOY_WAIT_ATTEMPTS || 40);
const delayMs = Number(process.env.DEPLOY_WAIT_MS || 3000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const results = await Promise.all(
    paths.map(async (path) => {
      const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
      try {
        const res = await fetch(url, { redirect: 'follow' });
        return { path, ok: res.ok, status: res.status };
      } catch (err) {
        return { path, ok: false, status: err.message };
      }
    }),
  );

  const pending = results.filter((r) => !r.ok);
  if (pending.length === 0) {
    console.log(`Ready (${attempt}/${maxAttempts}): ${base}`);
    process.exit(0);
  }

  console.log(
    `Attempt ${attempt}/${maxAttempts} — waiting on ${pending.map((r) => `${r.path}→${r.status}`).join(', ')}`,
  );
  await sleep(delayMs);
}

console.error(`Timed out waiting for ${base}`);
process.exit(1);
