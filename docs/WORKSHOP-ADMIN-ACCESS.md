# Workshop admin — Cloudflare Access

Admin UI: **`/admin/`** (dedicated layout). Legacy **`/workshop/admin/`** redirects to `/admin/`.

Admin API: **`/admin/api/*`** (same Access session as the UI — no separate Access app needed).

Access is enforced at the edge with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/).

## Allowed identity

| Email | Role |
|-------|------|
| `sycu.lee@gmail.com` | Workshop admin (create/list events, view signups) |

Configure via Pages secret/variable: `WORKSHOP_ADMIN_EMAILS=sycu.lee@gmail.com` (comma-separated for multiple).

Legacy `WORKSHOP_ADMIN_KEY` still works for API automation if set.

## One-time setup (Dashboard)

Create **one** self-hosted Access application per hostname:

1. [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → **Access** → **Applications** → **Add application**
2. **Self-hosted**
3. **Application domain:** `onboarding.orangecloud.vn`
4. **Path:** `/admin`
5. **Policies** → Add rule → **Allow** → **Include** → **Emails** → `sycu.lee@gmail.com`
6. Save

Path `/admin` protects both the admin UI and `/admin/api/*` (me, events, signups).

You do **not** need a separate app for `/api/workshop-admin` (legacy path; optional for external automation only).

Repeat for UAT (do not protect the whole hostname):

| Environment | Hostname | Access path | Public site |
|-------------|----------|-------------|-------------|
| Production | `onboarding.orangecloud.vn` | `/admin` | `/`, `/workshop/`, … |
| UAT | `onboarding-uat.orangecloud.vn` | `/admin` | `/`, `/workshop/`, … |

If UAT homepage (`/`) redirects to Cloudflare Access, the path is too broad — set **Path** to `/admin` (not `/` or blank).

When the whole hostname is behind Access, static files (`/_astro/*`, `/styles/site.css`, `/assets/*`) may not load and the site appears unstyled with duplicated VI/EN text. Fix:

1. **Preferred:** one Access app with **Path** `/admin` only (public site stays open).
2. **If site-wide Access is required:** add a **Bypass** policy (precedence above Allow) for paths:
   - `/_astro/*`
   - `/styles/*`
   - `/assets/*`
   - `/images/*`

Verify after deploy: `curl -I https://<host>/styles/site.css` must return `Content-Type: text/css` (not `text/html` or `302` Access login).

## Automated setup (API)

Token needs **Account → Access: Apps and Policies → Edit**.

```bash
set CLOUDFLARE_API_TOKEN=...
set CLOUDFLARE_ACCOUNT_ID=...
npm run access:workshop-admin
```

Creates Access apps for `/admin` and legacy `/workshop/admin`.

## Pages environment

| Variable | Value |
|----------|--------|
| `WORKSHOP_ADMIN_EMAILS` | `sycu.lee@gmail.com` |

## SEO / crawlers

- `robots.txt` disallows `/admin/` and `/workshop/admin/`
- `noindex` + `X-Robots-Tag: noindex, nofollow`

## Verify

1. Open `/admin/` in a private window → Cloudflare Access login
2. Sign in with `sycu.lee@gmail.com` → dashboard loads (Overview, Events, Registrations)
3. DevTools → Network → `/admin/api/me` returns `{ "authorized": true, ... }`
