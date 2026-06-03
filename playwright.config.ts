import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: {
    // Ignore BASE_URL (used by smoke:prod); E2E targets local preview unless E2E_BASE_URL is set.
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: undefined,
});
