// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://cloudflare-starter-hub.pages.dev',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx(), sitemap()]
});