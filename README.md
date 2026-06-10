# Cloudflare Onboarding Journey

[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/pages/)
[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?style=flat-square&logo=astro)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**Cloudflare Starter Hub** — a bilingual (Vietnamese-first) learning site that helps beginners go from *“I don’t know where to start”* to a clear path across **Application Services**, **Developer Platform**, and **Cloudflare One**.

Live sites:

| Environment | URL |
|-------------|-----|
| **Production** | [onboarding.orangecloud.vn](https://onboarding.orangecloud.vn) |
| **Production (Pages)** | [cloudflare-starter-hub.pages.dev](https://cloudflare-starter-hub.pages.dev) |
| **UAT** | [onboarding-uat.orangecloud.vn](https://onboarding-uat.orangecloud.vn) |

Source: [github.com/sycu8/cloudflare-onboarding-journey](https://github.com/sycu8/cloudflare-onboarding-journey)

> **Contributors:** we welcome PRs. Every contribution is **reviewed and approved by the maintainer** ([@sycu8](https://github.com/sycu8)) before merge; only the maintainer deploys to production. See [Contributing](#contributing).

---

## Recent updates (2026)

| Area | What’s new |
|------|------------|
| **Cloudflare 101** | **Terminology** tabs + **practical guides** (DNS, TLS, WAF, Bot, Cache, LB) from internal training docs — [`/cloudflare-101#terminology`](https://onboarding.orangecloud.vn/cloudflare-101/#terminology) |
| **Learning tracks** | Per-lesson pages (`/tracks/{track}/{lessonId}`), deep dives, **Lưu ý (best practices)**, **Ví dụ triển khai**, **Lỗi thường gặp** |
| **Use cases** | Hub at [`/use-cases`](https://onboarding.orangecloud.vn/use-cases/) — scenarios across Application Services, Developer Platform, and Cloudflare One |
| **Workshop admin** | Dedicated UI at **`/admin/`** (Cloudflare Access on `/admin` only) — events, signups export; legacy `/workshop/admin` redirects — [WORKSHOP-ADMIN-ACCESS.md](docs/WORKSHOP-ADMIN-ACCESS.md) |
| **Agent discovery** | `/.well-known/*`, OpenAPI, WebMCP bootstrap, `/docs/api` — [DNS-AID.md](docs/DNS-AID.md) for DNS records |
| **Deploy** | `npm run deploy:uat` then `npm run deploy`; stable CSS at `/styles/site.css`; GitHub Actions gates — [UAT-DEPLOYMENT.md](docs/UAT-DEPLOYMENT.md) |
| **Contributions** | PR template, CI verify, `npm run review:pr`, [CONTRIBUTION_MAP](docs/CONTRIBUTION_MAP.md) |

---

## What this project is

| Goal | How the hub helps |
|------|-------------------|
| Reduce product-name overwhelm | Mental models + 3 tracks instead of memorizing SKUs |
| Pick a learning path | Choose Your Path, 7-day plan, track pages |
| Practice retention | Checklist (localStorage), 12-question knowledge check |
| Go deeper officially | Curated links: [Resource Hub](https://www.cloudflare.com/resource-hub/), Reference Architecture, GitHub, Learning Center |
| Field context | CloudSecOp reading lists (external blog) |
| Workshop interest | Signup form + admin-managed events at `/admin/` (D1, Cloudflare Access) |

### Learning journey

```text
Home → Start Here → Cloudflare 101 → Choose Your Path
  → Track / Use case → Checklist → Quiz → Workshop
```

Optional: [**First week (7 days)**](/first-week) — day-by-day plan, common mistakes, 2026 product snapshot.

---

## Features

- **Bilingual UI** — Vietnamese default; **EN/VI** language switcher (`cfhub_language` in localStorage)
- **Dark mode** — `cfhub_theme` in localStorage
- **3 learning tracks** — Application Services, Developer Platform, Cloudflare One (modules, outcomes, **lesson pages** with best practices & deployment examples)
- **Use cases hub** — [`/use-cases`](/use-cases): protect website, secure API, serverless app, VPN replacement, remote users (grouped by track)
- **Product pages** — searchable catalog at `/products` (Workers, WAF, Zero Trust, D1, R2, …)
- **Cloudflare 101 extras** — terminology dictionary (6 categories, CSS tabs, search) + lab-style config/WAF guides
- **Search** — instant search (245+ indexed pages/terms) via Ctrl+K; optional [Cloudflare AI Search](docs/AI-SEARCH-SETUP.md) for semantic results
- **Interactive** — glossary search + pagination, quiz with explanations, checklist progress, path selector
- **Resources hub** — official docs grid (synced), Reference Architecture **diagrams**, Resource Hub, GitHub, CloudSecOp, Learning Center
- **Solutions & demos** — bilingual solution proposals, SE demo guides, content-delivery guide, plan comparison
- **SEO** — per-page title/description, Open Graph, Twitter cards, canonical URLs
- **Cloudflare branding** — orange cloud favicon and navbar logo; static assets via R2 `/assets/*` in production
- **Pages Functions** — workshop events, signups, quiz submissions, site config, asset proxy, optional Workers AI
- **D1 + KV + R2** — production-ready bindings (configure in your account)

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro 6](https://astro.build/) (static-first) |
| UI | [Tailwind CSS 4](https://tailwindcss.com/), [React 19](https://react.dev/) islands |
| Hosting | [Cloudflare Pages](https://developers.cloudflare.com/pages/) |
| API | [Pages Functions](https://developers.cloudflare.com/pages/functions/) |
| Database | [D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Config / rate limit | [KV](https://developers.cloudflare.com/kv/) |
| Static images | [R2](https://developers.cloudflare.com/r2/) + `/assets/*` Pages Function |
| Bot protection | [Turnstile](https://developers.cloudflare.com/turnstile/) (optional) |
| AI (optional) | [Workers AI](https://developers.cloudflare.com/workers-ai/) |

---

## Project structure

```text
cloudflare-onboarding-journey/
├── public/                 # favicon, og-image, static assets
├── src/
│   ├── components/         # Astro + React (chrome, content, interactive)
│   ├── data/               # tracks, quiz, glossary, resources, cloudsecop, etc.
│   ├── i18n/               # language helpers
│   ├── layouts/            # BaseLayout (SEO, title, theme)
│   ├── lib/                # SEO, applyPageLang, server helpers
│   └── pages/              # routes (tracks, lessons, products, use-cases, …)
├── functions/              # Pages Functions (api/, assets/)
├── migrations/             # D1 SQL migrations
├── docs/                   # UAT-DEPLOYMENT, WORKSHOP-ADMIN-ACCESS, DNS-AID, imports/
├── agent-discovery/        # source for /.well-known (built to public/ + dist)
├── .github/                # CONTRIBUTING, PR template, verify + deploy workflows
├── scripts/                # build.mjs, smoke-test, sync, access setup
├── tests/                  # Playwright E2E
├── wrangler.toml.example   # copy → wrangler.toml (not committed)
├── .env.example            # secrets template (not committed)
└── astro.config.mjs
```

---

## Quick start (local)

**Requirements:** Node.js ≥ 22.12

```bash
git clone https://github.com/sycu8/cloudflare-onboarding-journey.git
cd cloudflare-onboarding-journey
npm install
cp .env.example .env
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your D1/KV IDs (see Cloudflare setup below)
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

```bash
npm run build      # production static output → dist/
npm run preview    # serve dist/
npm run test:smoke # HTTP smoke (optional URL arg)
npm run test:e2e   # Playwright — local preview on :4321 (uses E2E_BASE_URL, not BASE_URL)
npm run deploy:uat      # build + deploy to UAT Pages project (maintainer)
npm run deploy          # build + deploy production (maintainer)
npm run deploy:verify   # smoke production domains
npm run access:workshop-admin  # optional: create Access apps for /admin
npm run resources:sync  # refresh developers.cloudflare.com link catalog
npm run diagrams:sync   # refresh Reference Architecture diagram metadata
npm run assets:sync     # upload public SVGs → R2 (needs Wrangler credentials)
npm run review:pr -- 12 # maintainer: fetch PR, diff, zone map (see Contributing)
```

---

## Cloudflare setup

### 1. Pages project

1. Create a [Cloudflare Pages](https://developers.cloudflare.com/pages/) project connected to this repo, **or** deploy with Wrangler:

   ```bash
   npm run deploy
   # or: npm run build && npx wrangler pages deploy dist --project-name=cloudflare-starter-hub
   npm run deploy:verify
   ```

2. **Build settings**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `22` or newer

### 2. D1 database

```bash
npx wrangler d1 create cloudflare-starter-hub-db
# Put database_id into wrangler.toml

npx wrangler d1 migrations apply cloudflare-starter-hub-db --remote
```

Migrations: `migrations/0001_init.sql`, `migrations/0002_workshop_events.sql`.

### 3. KV namespace

```bash
npx wrangler kv namespace create SITE_CONFIG
# Put id into wrangler.toml
```

### 4. R2 bucket (static images)

```bash
npx wrangler r2 bucket create cloudflare-starter-hub-resources
npm run assets:sync   # uploads public/*.svg, favicon.ico → R2 static/*
```

Production serves them at `/assets/<file>` (immutable cache). Source files stay in `public/` for local `astro dev` and as the upload source.

**Cache & security headers** (`public/_headers`, deployed with Pages):

| Path | Policy |
|------|--------|
| HTML (`/*`) | Browser 5m + SWR 24h; CDN 1h (`CDN-Cache-Control`) — fast deploy pickup at edge, good Core Web Vitals on repeat visits |
| `/_astro/*`, `/assets/*` | 1 year `immutable` (hashed or versioned static) |
| `/styles/site.css` | 1h + SWR — stable global stylesheet |
| `robots.txt` / sitemaps | 24h / 1h — crawlers see updates without hammering origin |
| `/api/*`, `/admin/*` | `no-store` — never cache dynamic or admin UI |

Security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, etc.) apply to all pages via `/*`.

**Agent discovery** (RFC 8288, RFC 9727, WebMCP): generated before build via `npm run agent-discovery:build` using `PUBLIC_SITE_URL`. Serves `/.well-known/api-catalog`, OpenAPI, OAuth metadata, MCP/A2A cards, agent skills index, `/auth.md`, and homepage `Link` headers. DNS-AID records are documented in `docs/DNS-AID.md` (requires DNS zone changes on `orangecloud.vn`).

### 5. Pages secrets (dashboard or CLI)

Set in **Pages → Settings → Environment variables** (production). **Never commit these values.**

| Variable | Purpose |
|----------|---------|
| `WORKSHOP_ADMIN_EMAILS` | Comma-separated emails allowed via Cloudflare Access (admin UI + `/admin/api/*`) |
| `WORKSHOP_ADMIN_KEY` | Optional Bearer token for legacy `/api/workshop-admin/*` automation |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile verification |
| `RATE_LIMIT_SALT` | Salt for IP hashing in rate limits |
| `CLOUDFLARE_API_TOKEN` | Only if using CI deploy (not stored in repo) |

Public (safe in `.env` / Pages **plain** vars):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SITE_URL` | Canonical site URL for sitemap/OG |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget site key |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | Web Analytics (optional) |
| `PUBLIC_ASSETS_BASE_URL` | Optional direct R2/public CDN URL (else `/assets/*`) |

Copy from `.env.example` — fill locally in `.env` only.

### 6. Bindings (Pages → Functions)

Ensure bindings match `wrangler.toml.example`:

- `DB` → D1  
- `SITE_CONFIG` → KV  
- `RESOURCES_BUCKET` → R2  
- `AI` → Workers AI (optional, for `/api/generate`)

### 7. Workshop admin

1. Create a **Cloudflare Access** app with path **`/admin`** only (not the whole hostname) — see [docs/WORKSHOP-ADMIN-ACCESS.md](docs/WORKSHOP-ADMIN-ACCESS.md) or `npm run access:workshop-admin`.  
2. Set `WORKSHOP_ADMIN_EMAILS` in Pages (e.g. `you@example.com`).  
3. Visit **`/admin/`** → sign in with Access → manage events and view signups.  
4. Public workshop page: `/workshop` lists events via `GET /api/workshop-events`.

Legacy `/workshop/admin` redirects to `/admin/`.

---

## API routes (Pages Functions)

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/workshop-events` | GET, POST | List/create workshop events (POST requires admin) |
| `/api/workshop-signup` | POST | Workshop registration (Turnstile + D1) |
| `/admin/api/me` | GET | Admin session (Cloudflare Access email) |
| `/admin/api/events` | GET, POST | List/create events (Access-protected) |
| `/admin/api/signups` | GET | Export signups (Access-protected) |
| `/api/quiz-submission` | POST | Anonymous quiz score logging |
| `/api/site-config` | GET | Feature flags from KV |
| `/api/feedback` | POST | Feedback messages |
| `/api/generate` | POST | Workers AI demo (optional binding) |

Admin auth header: `Authorization: Bearer <WORKSHOP_ADMIN_KEY>` or `X-Cfhub-Admin-Key: <WORKSHOP_ADMIN_KEY>`.

---

## Security notes

- **`.env`, `wrangler.toml`, and `.dev.vars` are gitignored** — use `.env.example` and `wrangler.toml.example` only.  
- Do not commit API tokens, admin keys, or Turnstile secrets.  
- `wrangler.toml` in this workspace may exist locally with your resource IDs; keep it local or use dashboard bindings only.  
- Workshop signup sends `turnstileToken: 'dev-bypass'` only when **no** `TURNSTILE_SECRET_KEY` is bound; production must set the secret and embed Turnstile on the form. See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).  
- Rate limiting uses KV when `SITE_CONFIG` is bound.

---

## Main routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/start-here` | 30-minute intro |
| `/first-week` | 7-day beginner plan |
| `/cloudflare-101` | Product map + **terminology** (`#terminology`) + **practical guides** (`#practical-guides`) |
| `/choose-your-path` | Path selector |
| `/tracks`, `/tracks/{track}` | Track overview + track-scoped resources |
| `/tracks/{track}/{lessonId}` | Lesson: deep dive, best practices, deployment examples, common mistakes |
| `/use-cases` | Use case hub (3 tracks) |
| `/use-cases/{slug}` | Single scenario (architecture, steps, mistakes) |
| `/products`, `/products/{slug}` | Product catalog & detail pages |
| `/checklists/beginner-cloudflare-checklist` | Interactive checklist |
| `/quiz/beginner-readiness` | 12-question knowledge check |
| `/search` | Site search (instant + AI Search when configured) |
| `/glossary` | Searchable glossary |
| `/resources` | Resource Hub, GitHub, Ref Arch, diagram gallery, CloudSecOp, Learning Center |
| `/changelog` | Curated Cloudflare Developer Changelog |
| `/status` | Live system status & incidents (Statuspage API) |
| `/plans` | Plan comparison (Free/Pro/Business/Enterprise) for SMEs |
| `/demo-guides` | SE demo scripts — Application Security & Cloudflare One |
| `/content-delivery` | CDN, cache, Speed — speed up websites guide |
| `/solutions` | Solution proposal summaries (App Security, SASE, Email) — EN/VI |
| `/workshop` | Events + signup |
| `/admin/` | Workshop admin (Cloudflare Access, noindex) |
| `/workshop/admin` | Redirect → `/admin/` |
| `/docs/api` | API catalog for agents (WebMCP / OpenAPI) |
| `/privacy` | Privacy |

---

## Content sources

Curated links align with official Cloudflare materials:

- [Developer Documentation](https://developers.cloudflare.com/)
- [Resource Hub](https://www.cloudflare.com/resource-hub/)
- [Architecture Center](https://www.cloudflare.com/architecture/)
- [Learning Center](https://www.cloudflare.com/learning/)
- [github.com/cloudflare](https://github.com/cloudflare)
- [CloudSecOp Cloudflare tag](https://cloudsecop.net/tag/cloudflare/) (community; not official)

---

## Contributing

We are open to contributions — thank you for improving the hub for learners.

### For contributors

1. Read **[.github/CONTRIBUTING.md](.github/CONTRIBUTING.md)** and **[docs/CONTRIBUTION_MAP.md](docs/CONTRIBUTION_MAP.md)** (which folders are high-risk).
2. **Fork** the repo, branch from `main` (`feat/…` or `fix/…`).
3. Run locally: `npm run build`, and for UI changes `npm run test:smoke` / `npm run test:e2e`.
4. **Open a pull request** into `main` and fill the [PR checklist](.github/pull_request_template.md).
5. GitHub Actions **Verify PR** runs build + smoke on your branch automatically.

### Approval & deploy (maintainer only)

| Step | Who | What happens |
|------|-----|----------------|
| Review | **Maintainer** ([@sycu8](https://github.com/sycu8)) | Reads the PR, CI results, and optional agent review; may request changes |
| **Approve** | **Maintainer** | Merges only after explicit approval — contributors do not merge to `main` by default |
| Deploy UAT | **Maintainer** | Approve GitHub env `uat` on PR, or `npm run deploy:uat` locally |
| Deploy prod | **Maintainer** | After UAT OK: merge → approve `production` or `npm run deploy` → `npm run deploy:verify` |

**You will be notified in the PR** when it is approved, needs changes, or is merged. Production URLs update only after maintainer deploy.

Questions or intent before coding? [Open an issue](https://github.com/sycu8/cloudflare-onboarding-journey/issues).

### Maintainer — review a PR locally

```bash
gh auth login
npm run review:pr -- 12          # fetch, diff, zone map
npm run review:pr -- 12 --verify # + isolated build in .worktrees/
```

Details: [docs/MAINTAINER_REVIEW.md](docs/MAINTAINER_REVIEW.md). Cursor/agent: [AGENTS.md](AGENTS.md).

---

## License

MIT — see [LICENSE](LICENSE) if present, or add your preferred license.

---

## Author

Maintained by [@sycu8](https://github.com/sycu8) as an onboarding journey for Cloudflare learners.

**Questions?** Open an issue on [GitHub](https://github.com/sycu8/cloudflare-onboarding-journey/issues).
