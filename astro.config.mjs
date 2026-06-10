// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';
import { searchIndexIntegration } from './src/integrations/searchIndex.ts';

// https://astro.build/config
const site = (process.env.PUBLIC_SITE_URL || 'https://onboarding.orangecloud.vn').replace(/\/$/, '');

export default defineConfig({
  site,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    mdx(),
    searchIndexIntegration(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/workshop/admin'),
    }),
  ],
});