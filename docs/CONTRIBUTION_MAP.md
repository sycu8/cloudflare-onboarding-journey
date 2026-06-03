# Contribution map — where changes hurt

Use this when reviewing a PR: match changed files to risk zones before merge.

| Zone | Paths | If changed wrong… |
|------|--------|-------------------|
| **Routing & SEO** | `src/pages/**`, `src/lib/seo.ts`, `astro.config.*` | 404s, broken sitemap, wrong canonical/OG |
| **Chrome & i18n** | `src/components/chrome/**`, `src/components/ui/**`, `src/i18n/**`, `src/styles/global.css` | Broken nav, language switcher, layout on mobile |
| **Learning content** | `src/data/tracks.ts`, `trackLessons.ts`, `trackLessonBestPractices.ts`, `useCases.ts`, `beginnerJourney.ts` | Wrong lesson links, track isolation broken |
| **Catalog / sync data** | `src/data/*.data.json`, `scripts/sync-*.mjs`, `scripts/scrape-*.mjs` | Stale or huge JSON diffs; run sync scripts after merge |
| **Interactive islands** | `src/components/interactive/**` | Hydration errors, client-only bugs |
| **Pages Functions** | `functions/**` | Workshop API, assets proxy, rate limits broken in prod |
| **Bindings & deploy** | `wrangler.toml.example`, `package.json` deploy scripts | Prod deploy fails; never commit real `wrangler.toml` |
| **Tests** | `tests/**`, `playwright.config.ts`, `scripts/smoke-test.mjs` | False green CI or missed regressions |
| **Static & headers** | `public/**`, `public/_headers` | Cache/security headers wrong on Pages |

## Must not appear in PRs

- `.env`, `.dev.vars`, `wrangler.toml` (real IDs/secrets)
- `node_modules/`, `dist/`, `.wrangler/`
- API keys, `WORKSHOP_ADMIN_KEY`, Turnstile secrets

## After merge (maintainer only)

1. `git pull origin main`
2. `npm run build` && `npm run test:smoke` (local preview) or rely on green CI
3. `npm run deploy` then `npm run deploy:verify` — **only maintainer**, not contributors

## Regenerate data (if PR touches sync scripts)

```bash
npm run resources:sync    # cloudflareResources.data.json
npm run diagrams:sync     # referenceDiagrams.data.json
npm run assets:sync       # R2 static assets (needs credentials)
```
