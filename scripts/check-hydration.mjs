import { chromium } from '@playwright/test';

const url = process.argv[2] || 'https://cloudflare-starter-hub.pages.dev/choose-your-path';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') console.log('console.error:', m.text());
});
page.on('pageerror', (e) => console.log('pageerror:', e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const ssrCount = await page.locator('astro-island[ssr]').count();
const total = await page.locator('astro-island').count();
console.log({ url, ssrCount, total, lang: await page.locator('html').getAttribute('data-lang') });

await page.getByRole('button', { name: /Website\/app|faster or safer/i }).click({ timeout: 5000 }).catch((e) => {
  console.log('click failed:', e.message);
});
console.log('url after click', page.url());
await browser.close();
