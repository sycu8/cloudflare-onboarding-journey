# Production checklist

Runbook for **Cloudflare Starter Hub** — static Astro site + Pages Functions on Cloudflare.

**Live URLs (Jun 2026)**

| URL | Role |
|-----|------|
| https://cloudflare-starter-hub.pages.dev | Pages default domain |
| https://onboarding.orangecloud.vn | Custom domain |

---

## Phase 1 — Infrastructure (one-time)

- [x] Pages project: `cloudflare-starter-hub`
- [x] D1: `cloudflare-starter-hub-db` — migrations applied (`0001`, `0002`)
- [x] KV: `SITE_CONFIG` — rate limits, feature flags
- [x] R2: `cloudflare-starter-hub-resources` — favicon, OG image via `/assets/*`
- [x] Custom domain: `onboarding.orangecloud.vn`
- [ ] Turnstile widget for production hostname (optional until workshop signup goes live)
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` when signup is public

Bindings (Pages → Settings → Functions) must match `wrangler.toml`:

| Binding | Purpose |
|---------|---------|
| `DB` | D1 — workshop events, signups, quiz, feedback |
| `SITE_CONFIG` | KV — rate limits, `workshopEnabled`, banners |
| `RESOURCES_BUCKET` | R2 — static images (`static/*` → `/assets/*`) |
| `AI` | Workers AI (optional — `/api/generate`) |

Secrets (Pages → Environment variables, **Production**):

| Variable | Required | Notes |
|----------|----------|--------|
| `WORKSHOP_ADMIN_KEY` | Admin | Bearer for `/workshop/admin` and `POST /api/workshop-events` |
| `TURNSTILE_SECRET_KEY` | Signup | Rejects `dev-bypass` when set |
| `RATE_LIMIT_SALT` | Recommended | Hashed IP/UA keys in KV |

Build-time (Pages build env or local `.env`):

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SITE_URL` | Canonical + sitemap (default: `https://cloudflare-starter-hub.pages.dev`) |

---

## Phase 2 — Build & deploy

```bash
npm ci
npm run build                    # dist/ + copy public assets for preview fallback
npm run assets:sync              # only after changing public/*.svg or favicon
npm run deploy                   # build + wrangler pages deploy
npm run deploy:verify            # smoke both production domains
```

Manual deploy (same as `npm run deploy`):

```bash
npx wrangler pages deploy dist --project-name=cloudflare-starter-hub
```

Apply D1 migrations when schema changes:

```bash
npx wrangler d1 migrations apply cloudflare-starter-hub-db --remote
```

---

## Phase 3 — Verification

### Automated

```bash
npm run build
npm run test:smoke -- http://127.0.0.1:4321   # after npm run preview
npm run test:prod                              # both live domains
E2E_BASE_URL=https://cloudflare-starter-hub.pages.dev npm run test:e2e
```

> **Note:** Playwright uses `E2E_BASE_URL`, not `BASE_URL`. `BASE_URL` is for smoke tests only.

### Manual smoke (post-deploy)

- [ ] `/` — CTAs, hero, footer links
- [ ] Navbar — primary links (desktop), hamburger (mobile `< md`)
- [ ] Language — **EN/VI** toggle (icon + label), persists in `localStorage`
- [ ] Theme — dark/light toggle
- [ ] `/cloudflare-101` — product map sections
- [ ] `/resources#reference-diagrams` — diagram gallery + filters
- [ ] `/changelog` — curated product updates
- [ ] `/status` — live status dashboard + Refresh
- [ ] `/checklists/beginner-cloudflare-checklist` — persists in localStorage
- [ ] `/quiz/beginner-readiness` — full 12-question flow
- [ ] `GET /api/workshop-events` → 200
- [ ] `GET /api/site-config` → 200
- [ ] `GET /assets/favicon.svg` → 200
- [ ] `/robots.txt` + `/sitemap-index.xml`

---

## Phase 4 — Optional hardening

- [ ] Cloudflare Web Analytics (`PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`)
- [ ] Turnstile on `/workshop` signup form
- [ ] Git-connected Pages CI (build on push to `main`)
- [ ] Staging branch + preview URLs per PR

---

## Security

- Never commit `.env`, `.dev.vars`, or `wrangler.toml` with real IDs to public repos.
- Rotate `WORKSHOP_ADMIN_KEY` if exposed.
- `/workshop/admin` is `noindex` — still require admin key only.

---

## Last verified

- **Date:** 2026-06-03
- **Build:** 31 static pages
- **Smoke:** pass on `.pages.dev` and `onboarding.orangecloud.vn`
- **E2E:** 12/12 on production
- **APIs:** `/api/workshop-events`, `/api/site-config` → 200
- **D1:** no pending migrations
