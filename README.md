# Cloudflare Onboarding Journey

[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/pages/)
[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?style=flat-square&logo=astro)](https://astro.build/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**Cloudflare Starter Hub** — a bilingual (Vietnamese-first) learning site that helps beginners go from *“I don’t know where to start”* to a clear path across **Application Services**, **Developer Platform**, and **Cloudflare One**.

Live demos:

- [cloudflare-starter-hub.pages.dev](https://cloudflare-starter-hub.pages.dev)
- [onboarding.orangecloud.vn](https://onboarding.orangecloud.vn) (custom domain, if configured)

Source mirror: [github.com/sycu8/cloudflare-onboarding-journey](https://github.com/sycu8/cloudflare-onboarding-journey)

---

## What this project is

| Goal | How the hub helps |
|------|-------------------|
| Reduce product-name overwhelm | Mental models + 3 tracks instead of memorizing SKUs |
| Pick a learning path | Choose Your Path, 7-day plan, track pages |
| Practice retention | Checklist (localStorage), 12-question knowledge check |
| Go deeper officially | Curated links: [Resource Hub](https://www.cloudflare.com/resource-hub/), Reference Architecture, GitHub, Learning Center |
| Field context | CloudSecOp reading lists (external blog) |
| Workshop interest | Signup form + optional admin-managed events (D1) |

### Learning journey

```text
Home → Start Here → Cloudflare 101 → Choose Your Path
  → Track / Use case → Checklist → Quiz → Workshop
```

Optional: [**First week (7 days)**](/first-week) — day-by-day plan, common mistakes, 2026 product snapshot.

---

## Features

- **Bilingual UI** — Vietnamese default; “English only” toggle (`cfhub_language` in localStorage)
- **Dark mode** — `cfhub_theme` in localStorage
- **3 learning tracks** — Application Services, Developer Platform, Cloudflare One (modules + outcomes)
- **Use cases** — protect website, secure API, serverless app, VPN replacement, remote users
- **Interactive** — glossary search + pagination, quiz with explanations, checklist progress, path selector
- **Resources hub** — Resource Hub index, Reference Architecture, GitHub repos, CloudSecOp grid (paginated), Learning Center topics (paginated)
- **SEO** — per-page title/description, Open Graph, Twitter cards, canonical URLs
- **Cloudflare branding** — orange cloud favicon and navbar logo
- **Pages Functions** — workshop events, signups, quiz submissions, site config, optional Workers AI generate endpoint
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
| Files (future) | [R2](https://developers.cloudflare.com/r2/) |
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
│   └── pages/              # routes (22 static pages)
├── functions/api/          # Pages Functions (workshop, quiz, generate, …)
├── migrations/             # D1 SQL migrations
├── scripts/                # smoke-test, check-hydration
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
npm run test:smoke # HTTP smoke (optional: BASE URL arg)
npm run test:e2e   # Playwright (start preview on :4321 or set BASE_URL)
```

---

## Cloudflare setup

### 1. Pages project

1. Create a [Cloudflare Pages](https://developers.cloudflare.com/pages/) project connected to this repo, **or** deploy with Wrangler:

   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=cloudflare-starter-hub
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

### 4. R2 bucket (optional)

```bash
npx wrangler r2 bucket create cloudflare-starter-hub-resources
```

### 5. Pages secrets (dashboard or CLI)

Set in **Pages → Settings → Environment variables** (production). **Never commit these values.**

| Variable | Purpose |
|----------|---------|
| `WORKSHOP_ADMIN_KEY` | Bearer token for `POST /api/workshop-events` and admin UI |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile verification |
| `RATE_LIMIT_SALT` | Salt for IP hashing in rate limits |
| `CLOUDFLARE_API_TOKEN` | Only if using CI deploy (not stored in repo) |

Public (safe in `.env` / Pages **plain** vars):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SITE_URL` | Canonical site URL for sitemap/OG |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget site key |
| `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | Web Analytics (optional) |

Copy from `.env.example` — fill locally in `.env` only.

### 6. Bindings (Pages → Functions)

Ensure bindings match `wrangler.toml.example`:

- `DB` → D1  
- `SITE_CONFIG` → KV  
- `RESOURCES_BUCKET` → R2  
- `AI` → Workers AI (optional, for `/api/generate`)

### 7. Workshop admin

1. Set `WORKSHOP_ADMIN_KEY` in the Cloudflare dashboard.  
2. Visit `/workshop/admin` on your deployment.  
3. Enter the key in the UI to create published events.  
4. Events appear on `/workshop` via `GET /api/workshop-events`.

---

## API routes (Pages Functions)

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/workshop-events` | GET, POST | List/create workshop events (POST requires admin key) |
| `/api/workshop-signup` | POST | Workshop registration (Turnstile + D1) |
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
| `/cloudflare-101` | Product map (Compute, AI, Storage, Media, App Security, Cloudflare One) |
| `/choose-your-path` | Path selector |
| `/tracks`, `/tracks/*` | Learning tracks |
| `/use-cases/*` | Practical scenarios |
| `/checklists/beginner-cloudflare-checklist` | Interactive checklist |
| `/quiz/beginner-readiness` | 12-question knowledge check |
| `/glossary` | Searchable glossary |
| `/resources` | Resource Hub, GitHub, Ref Arch, CloudSecOp, Learning Center |
| `/workshop` | Events + signup |
| `/workshop/admin` | Event management (noindex) |
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

1. Fork the repo.  
2. Create a branch (`feat/my-change`).  
3. Run `npm run build` and `npm run test:e2e` when touching UI.  
4. Open a PR — no secrets in commits.

---

## License

MIT — see [LICENSE](LICENSE) if present, or add your preferred license.

---

## Author

Maintained by [@sycu8](https://github.com/sycu8) as an onboarding journey for Cloudflare learners.

**Questions?** Open an issue on [GitHub](https://github.com/sycu8/cloudflare-onboarding-journey/issues).
