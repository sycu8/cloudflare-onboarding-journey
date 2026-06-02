# Production checklist

Use this before/after deploying **Cloudflare Starter Hub** to Pages.

## Cloudflare Pages

- [ ] Project: `cloudflare-starter-hub` (or your fork)
- [ ] Build: `npm run build` → output `dist`
- [ ] Deploy: `npx wrangler pages deploy dist --project-name=cloudflare-starter-hub`
- [ ] Custom domain (optional): e.g. `onboarding.orangecloud.vn` → Pages custom domains
- [ ] `PUBLIC_SITE_URL` set to production URL for sitemap/canonical (build-time)

## Bindings (Pages → Settings → Functions)

| Binding | Purpose |
|---------|---------|
| `DB` | D1 — workshop events, signups, quiz, feedback |
| `SITE_CONFIG` | KV — rate limits, `workshopEnabled`, banners |
| `ASSETS` / R2 | Optional — future downloadable resources |

Apply SQL: `npx wrangler d1 migrations apply cloudflare-starter-hub-db --remote` (database name from your `wrangler.toml`).

## Secrets (Pages → Settings → Environment variables)

| Variable | Required | Notes |
|----------|----------|--------|
| `WORKSHOP_ADMIN_KEY` | Yes (admin) | Long random string; `/workshop/admin` |
| `TURNSTILE_SECRET_KEY` | Yes (signup) | From Turnstile dashboard; **disables `dev-bypass`** |
| `RATE_LIMIT_SALT` | Recommended | Random string for hashed IP/UA keys |
| `CLOUDFLARE_API_TOKEN` | CI only | Not needed in Pages runtime |

## Turnstile

1. Create a Turnstile widget for your production hostname.
2. Set `TURNSTILE_SECRET_KEY` in Pages.
3. Wire the site key in `WorkshopForm` (replace hardcoded `dev-bypass` when ready).
4. With secret set, server **rejects** `turnstileToken: 'dev-bypass'`.

## Smoke & E2E

```bash
npm run build
npm run test:smoke -- https://cloudflare-starter-hub.pages.dev
BASE_URL=https://cloudflare-starter-hub.pages.dev npm run test:e2e
```

## Post-deploy

- [ ] Hard refresh `/cloudflare-101` (product map sections)
- [ ] Test mobile menu + language toggle
- [ ] `GET /api/workshop-events` returns 200 (not 500)
- [ ] Workshop signup (with Turnstile) or admin create event
- [ ] `robots.txt` and OG image load

## Security

- Never commit `.env`, `.dev.vars`, or `wrangler.toml` with real IDs.
- Rotate `WORKSHOP_ADMIN_KEY` if exposed.
- `/workshop/admin` is `noindex` — still protect with admin key only.
