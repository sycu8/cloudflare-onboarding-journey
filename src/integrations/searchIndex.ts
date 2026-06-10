import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';
import { buildSearchDocuments } from '../lib/search/buildIndex';

function writeSearchIndex(logger: { info: (msg: string) => void }) {
  const documents = buildSearchDocuments();
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    documents,
  };
  const outPath = join(process.cwd(), 'public', 'search-index.json');
  writeFileSync(outPath, JSON.stringify(payload));
  logger.info(`search-index.json (${documents.length} documents)`);
}

export function searchIndexIntegration(): AstroIntegration {
  return {
    name: 'hub-search-index',
    hooks: {
      'astro:build:start': async ({ logger }) => writeSearchIndex(logger),
      'astro:server:start': async ({ logger }) => writeSearchIndex(logger),
    },
  };
}
