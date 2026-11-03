# Agent instructions (maintainer + contributions)

## Default role

You help the **maintainer** integrate external contributions safely. Contributors open PRs on GitHub; **only the maintainer** merges and runs `npm run deploy`.

## When the user asks to review a PR

1. Run `npm run review:pr -- <number>` (needs `gh auth login`).
2. Read output: zone mapping, forbidden files, overlap with local uncommitted files.
3. Optionally `npm run review:pr -- <number> --verify` for worktree build.
4. Read `git diff origin/main...pr-review-<number>` for logic/content review.
5. Cross-check [docs/CONTRIBUTION_MAP.md](docs/CONTRIBUTION_MAP.md) and [docs/MAINTAINER_REVIEW.md](docs/MAINTAINER_REVIEW.md).
6. Report: **Approve** | **Request changes** | **Block** with concrete file/line risks (routing, i18n, secrets, track links, JSON churn).

## Do not unless explicitly asked

- `git commit`, `git push`, merge PRs on GitHub
- `npm run deploy` or change Cloudflare dashboard secrets
- Amend contributor branches

## Merge + deploy (maintainer only)

After user merges on GitHub: `git pull origin main` → `npm run build` → `npm run test:smoke` (with preview) → `npm run deploy` → `npm run deploy:verify`.

## Project conventions

- Bilingual `{ vi, en }` for user-facing copy
- No secrets in repo; `wrangler.toml` is local-only
- Minimize scope; match existing Astro/React patterns in `src/`
- Blog visuals: prefer `diagramSlugs` → `public/ref-diagrams/` (official Cloudflare diagrams). Dashboard screenshots go in `public/images/blog/` via post `images` / `sections[].image` — see that folder’s README.
- Blog cadence: **1 post / 3 days** via email to `sycu.lee@gmail.com` (approve by reply `APPROVE` or link). See [docs/BLOG_SCHEDULE.md](docs/BLOG_SCHEDULE.md).
- **Cloudflare API:** use the [`cf`](https://github.com/cloudflare/cf) CLI (`scripts/lib/cf.mjs`, `npx cf …`) — not raw `fetch` to `api.cloudflare.com`. See [docs/CF-CLI.md](docs/CF-CLI.md). Wrangler stays for Pages `dev`/`deploy` and local D1/R2.

## Cursor Cloud specific instructions

Standard commands live in `package.json` and `README.md` (Quick start). The Cloud Agent environment installs dependencies and boots the full local Pages stack. Notes below are the non-obvious caveats.

- **Already running on boot:** `start` applies local D1 migrations, seeds R2 objects `static/favicon.svg`, `static/favicon.ico`, `static/og-image.svg`, and `static/logo-cloudflare.svg`, then serves Functions + static output at `http://127.0.0.1:4321` via `npx wrangler pages dev dist --port 4321 --ip 127.0.0.1`. If that URL already responds, `start` leaves the existing process alone. Do not start a second server on port 4321. If `dist/index.html` is missing, `start` runs `npm run build` before the server.
- **Prepared at environment build time (not on every boot):** `npm ci`, `.env` copied from `.env.example` when missing, a gitignored local `wrangler.toml` with D1/KV/R2 only, Playwright Chromium, and `npm run build`. A branch that changes the lockfile still needs its own `npm ci`. No Cloudflare API token is required for this local stack.
- **Cloudflare API (`cf`):** with `CLOUDFLARE_API_TOKEN` set, run `npm run cf:whoami` or `npx cf auth whoami`. Discover commands with `npx cf cli search "<task>"` (no nested `--help` chains). Maintainer API scripts (`dns-aid:setup`, `access:workshop-admin`) call `cf` via `scripts/lib/cf.mjs`.
- **Local config:** `.env` and `wrangler.toml` are gitignored. The generated `wrangler.toml` uses local placeholder IDs and omits `[ai]` and `[[ai_search]]`. `npm run dev` (astro dev) still serves **static pages only** — Pages Functions (`/api/*`, `/admin/*`, `/assets/*`) are NOT available — and it binds to `localhost` (IPv6 `::1`). Use another port if 4321 is already taken by `wrangler pages dev`.
- **AI bindings break local `wrangler pages dev`:** the `[ai]` and `[[ai_search]]` blocks in `wrangler.toml` force a remote proxy session and fail with `AI Search binding 'HUB_SEARCH' ... not found` unless a live AI Search instance + API token exist. Comment them out in your local `wrangler.toml` to run fully locally.
- **Tests target `http://127.0.0.1:4321` and assume Pages semantics.** Run `npm run test:smoke` and `npm run test:e2e` (set `E2E_BASE_URL=http://127.0.0.1:4321`) against a running `wrangler pages dev`, NOT `astro preview` — they assert `_headers` cache rules, trailing-slash redirects, and Function API routes that the plain Astro preview server does not emulate.
- **D1 before workshop APIs:** `npx wrangler d1 migrations apply cloudflare-starter-hub-db --local` (otherwise `/api/workshop-events` returns `dbReady:false` and signups fail).
- **`/assets/*` is R2-backed:** empty local R2 returns 404. Seed it with `npx wrangler r2 object put cloudflare-starter-hub-resources/static/<file> --file=public/<file> --local` (favicon.svg, favicon.ico, og-image.svg, logo-cloudflare.svg).
- **Expected local smoke "error":** `/admin → HTTP 308` — Cloudflare Access is not present locally, so `/admin` does a trailing-slash redirect instead of an Access 302/401/403. Not a code bug. The `well-known` JSON/markdown "missing `<main>`" lines are warnings only.
- **Workshop signup works without Turnstile locally:** with no `TURNSTILE_SECRET_KEY`, the form sends `turnstileToken: 'dev-bypass'` which the server accepts.
- **E2E browsers:** `npx playwright install chromium` (the cached browser may already be present in the VM). No `lint` script exists; type-check with `npx astro check` (needs `@astrojs/check`, not a default dependency).
