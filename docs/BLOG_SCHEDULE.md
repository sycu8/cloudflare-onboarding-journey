# Blog bi-daily schedule (email approve)

Cadence: **one bilingual post every 2 days** (`Asia/Ho_Chi_Minh`).

Notifications go **only** to `sycu.lee@gmail.com` (no GitHub issues).

## Flow

1. Cron (00:05 ICT) runs `.github/workflows/blog-biweekly-email.yml`.
2. If today is a schedule slot → email subject `[Blog] Duyệt bài YYYY-MM-DD: <slug>`.
3. You **Approve** by either:
   - Replying **`APPROVE`** (Reply-To: `blog-approve@orangecloud.vn`), or
   - Clicking the **Approve** link (`/api/blog-approve?token=…`).
4. Pages Function writes `blog_editorial` status=`approved` in D1.
5. `.github/workflows/blog-on-approve.yml` (cron every :20/:50) polls D1 with existing `CLOUDFLARE_API_TOKEN` and opens a scaffold PR.
6. Expand content → **merge PR** → deploy to publish.

## Sources of truth

| Piece | Path |
|-------|------|
| Queue | `src/data/blogSchedule.data.json` + `blogSchedule.ts` |
| CLI | `npm run blog:today` / `blog:scaffold` / `blog:upcoming` / `blog:email-body` |
| Approve API | `functions/api/blog-approve.ts` |
| Reply Worker | `workers/blog-email-inbox/` |
| D1 | `migrations/0003_blog_editorial.sql` |

## GitHub Actions secrets (reuse deploy credentials)

Already used by Deploy → **`production` environment** — blog workflows use the same env:

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Email Sending API + D1 read/write (store approve token, poll approvals) |
| `CLOUDFLARE_ACCOUNT_ID` | Account id for Email + D1 APIs |

Optional: `WORKSHOP_EMAIL_FROM` (default `Cloudflare Starter Hub <onboarding@orangecloud.vn>`).

If Environment **production** has required reviewers, approve the pending deployment when the blog workflow runs (or move these secrets to repository-level / a `blog` env without reviewers for unattended cron).

Approve tokens are stored in D1 by Actions; Pages verifies the link against D1 (no matching HMAC secret required on Pages).

## Pages secrets / vars

| Name | Notes |
|------|------|
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_EMAIL_API_TOKEN` / `WORKSHOP_EMAIL_FROM` | Already used for workshop mail (confirmation emails after approve) |
| `BLOG_EDITOR_EMAIL` | optional — default `sycu.lee@gmail.com` |
| `DB` binding | Required for approve token lookup |

Apply D1 migration (prod):

```bash
npx wrangler d1 migrations apply cloudflare-starter-hub-db --remote
```

## Email Routing (reply APPROVE)

1. `cd workers/blog-email-inbox && cp wrangler.toml.example wrangler.toml`
2. `npx wrangler secret put BLOG_APPROVE_SECRET` (same HMAC material as Pages/Actions)
3. `npx wrangler deploy`
4. Email Routing rule: `blog-approve@orangecloud.vn` → Worker `blog-email-inbox`

Without the Worker, the **Approve link** still works.

## CLI

```bash
npm run blog:today
npm run blog:upcoming
npm run blog:scaffold -- --date=2026-08-17
BLOG_APPROVE_SECRET=… npm run blog:email-body -- --date=2026-08-17
```

## Extending the queue

Add rows to `src/data/blogSchedule.data.json` (keep ≥14 days ahead, dates every **2** days).
