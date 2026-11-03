// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';
import { searchIndexIntegration } from './src/integrations/searchIndex.ts';
import { showCommercialContent } from './src/lib/siteFlags.mjs';

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
      filter: (page) => {
        if (page.includes('/admin') || page.includes('/workshop/admin')) return false;
        if (!showCommercialContent && (page.includes('/solutions') || page.includes('/cheatsheets/cloudflare-one-enterprise-vs-paygo'))) {
          return false;
        }
        return true;
      },
    }),
  ],
});