import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4321';

async function waitForIslands(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => typeof customElements !== 'undefined' && !!customElements.get('astro-island'));
  await page.waitForFunction(
    () => document.querySelectorAll('astro-island[ssr]').length === 0,
    { timeout: 15_000 },
  );
}

test.describe('Cloudflare Starter Hub E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      localStorage.clear();
      document.documentElement.dataset.lang = 'vi';
      document.documentElement.lang = 'vi';
      document.documentElement.classList.remove('dark');
    });
  });

  test('homepage CTAs navigate', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole('link', { name: /Bắt đầu tại đây|Start here/i }).first().click();
    await expect(page).toHaveURL(/start-here/);
  });

  test('language switcher toggles visibility', async ({ page }) => {
    await page.goto(`${BASE}/cloudflare-101`);
    await waitForIslands(page);
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'vi');
    const langBtn = page.getByRole('button', { name: /Switch to English|Switch to Vietnamese/i });
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await expect(page.locator('.lang-en').first()).toBeVisible();
  });

  test('theme toggle adds dark class', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitForIslands(page);
    await page.getByRole('button', { name: /Switch to dark mode/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('path selector navigates', async ({ page }) => {
    await page.goto(`${BASE}/choose-your-path`);
    await waitForIslands(page);
    await page.getByRole('button', { name: /faster or safer|nhanh hơn hoặc an toàn/i }).click();
    await expect(page).toHaveURL(/application-services/);
  });

  test('checklist toggles and persists', async ({ page }) => {
    await page.goto(`${BASE}/checklists/beginner-cloudflare-checklist`);
    await waitForIslands(page);
    const first = page.locator('input[type="checkbox"]').first();
    await first.check();
    await expect(first).toBeChecked();
    await page.reload();
    await waitForIslands(page);
    await expect(first).toBeChecked();
  });

  test('glossary search filters', async ({ page }) => {
    await page.goto(`${BASE}/glossary`);
    await waitForIslands(page);
    await page.getByPlaceholder(/DNS/i).fill('WAF');
    await expect(page.getByText('WAF', { exact: true }).first()).toBeVisible();
    await page.getByPlaceholder(/DNS/i).fill('zzznonexistent');
    await expect(page.getByText(/Không tìm thấy|No terms found/i).first()).toBeVisible();
  });

  test('quiz full flow', async ({ page }) => {
    await page.goto(`${BASE}/quiz/beginner-readiness`);
    await waitForIslands(page);
    const total = 12;
    for (let i = 0; i < total; i++) {
      await page.getByRole('button', { name: /^A\./ }).first().click();
      const continueBtn = page.getByRole('button', {
        name: i < total - 1 ? /Câu tiếp theo|Next question/i : /Xem tổng kết|See summary/i,
      });
      await expect(continueBtn).toBeVisible();
      await continueBtn.click();
    }
    await expect(page.getByText(/Kết quả kiểm tra|Knowledge check result/i).first()).toBeVisible();
    await expect(page.locator('p.text-4xl')).toContainText('/12');
  });

  test('mobile menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/`);
    await waitForIslands(page);
    await page.getByRole('button', { name: /^Menu$/i }).click();
    await expect(page.getByRole('link', { name: /^Bắt đầu$|^Start$/i }).first()).toBeVisible();
    await page.getByRole('button', { name: /^Thêm$|^More$/i }).click();
    await expect(page.getByRole('link', { name: /Tuần đầu|First week/i }).first()).toBeVisible();
  });

  test('resources anchors exist', async ({ page }) => {
    await page.goto(`${BASE}/resources#resource-hub`);
    await expect(page.locator('#resource-hub')).toBeVisible();
    await page.goto(`${BASE}/resources#reference-diagrams`);
    await expect(page.locator('#reference-diagrams')).toBeVisible();
    await page.goto(`${BASE}/resources#github`);
    await expect(page.locator('#github')).toBeVisible();
  });

  test('changelog and status pages load', async ({ page }) => {
    await page.goto(`${BASE}/changelog`);
    await expect(
      page.getByRole('heading', { name: /Product changelog|Changelog sản phẩm/i }).first(),
    ).toBeVisible();
    await page.goto(`${BASE}/status`);
    await waitForIslands(page);
    await expect(
      page.getByRole('heading', { name: /System status & incidents|Trạng thái hệ thống/i }).first(),
    ).toBeVisible();
  });

  test('status refresh button works', async ({ page }) => {
    await page.goto(`${BASE}/status`);
    await waitForIslands(page);
    const refresh = page.getByRole('button', { name: /Làm mới|Refresh/i });
    await expect(refresh).toBeVisible();
    await refresh.click();
    await expect(refresh).toBeEnabled({ timeout: 15_000 });
  });

  test('navbar primary links', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /Lộ trình|Tracks/i }).click();
    await expect(page).toHaveURL(/\/tracks/);
  });
});
