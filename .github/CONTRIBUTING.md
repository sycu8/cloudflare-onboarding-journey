# Contributing

Cảm ơn bạn muốn đóng góp **Cloudflare Starter Hub** / **cloudflare-onboarding-journey**.

## Before you start

- Read [README](../README.md) and [CONTRIBUTION_MAP.md](../docs/CONTRIBUTION_MAP.md) — know which folders are high-risk.
- Use **Node ≥ 22.12** (`package.json` `engines`).
- Copy `.env.example` → `.env` locally only — never commit secrets.

## Workflow

1. **Fork** [github.com/sycu8/cloudflare-onboarding-journey](https://github.com/sycu8/cloudflare-onboarding-journey)
2. **Branch** from `main`: `feat/short-description` or `fix/issue-topic`
3. **Change** the smallest area that solves the issue (content → `src/data/`; UI → `src/components/` + pages)
4. **Verify** locally:
   ```bash
   npm ci
   npm run build
   npm run preview -- --port 4321 --host 127.0.0.1
   # other terminal:
   npm run test:smoke
   npm run test:e2e    # if you changed UI / language switcher / nav
   ```
5. **Open a PR** into `main` — fill the PR template checklist.

CI will run build + smoke on your PR automatically.

## Content guidelines

- **Bilingual**: user-facing strings need `{ vi, en }` (see existing `src/data/*` and `LangText`).
- **Official sources**: learning facts and best practices should link to [developers.cloudflare.com](https://developers.cloudflare.com/) — do not invent product behavior.
- **Track isolation**: prefer links within the same track (`/tracks/{slug}/…`); hub-wide links only when intentional.

## Do not submit

| Item | Why |
|------|-----|
| `.env`, `.dev.vars`, `wrangler.toml` | Secrets / account IDs |
| `dist/`, `node_modules/` | Generated |
| Unrelated drive-by refactors | Harder to review |

## Large JSON / sync scripts

If you change `scripts/sync-*.mjs` or catalog scrapers, mention it in the PR and run the matching `npm run *:sync` so `.data.json` files stay consistent.

## Review & deploy

- Every PR is **reviewed and approved by the maintainer** ([@sycu8](https://github.com/sycu8)) before merge.
- You may get **request changes** comments — please update the branch and re-run CI.
- **Stage 1 (UAT):** maintainer approves GitHub Environment `uat` → PR deploys to UAT for preview.
- **Stage 2 (production):** after UAT OK and merge to `main`, maintainer approves environment `production` → live site updates.

See [UAT-DEPLOYMENT.md](../docs/UAT-DEPLOYMENT.md) and [MAINTAINER_REVIEW.md](../docs/MAINTAINER_REVIEW.md).

## Questions

Open a [GitHub issue](https://github.com/sycu8/cloudflare-onboarding-journey/issues) with context and, if possible, a screenshot or route path (`/tracks/...`).
