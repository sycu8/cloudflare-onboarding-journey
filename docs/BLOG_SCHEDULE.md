# Blog bi-daily schedule (email approve)

Cadence: **one bilingual post every 2 days** (`Asia/Ho_Chi_Minh`).

Notifications go **only** to `sycu.lee@gmail.com` (no GitHub issues).

## Flow

1. Cron (00:05 ICT) runs `.github/workflows/blog-biweekly-email.yml`.
2. If today is a schedule slot → email subject `[Blog] Duyệt bài YYYY-MM-DD: <slug>`.
3. You **Approve** by either:
   - Replying **`APPROVE`** (Reply-To: `blog-approve@orangecloud.vn`), or
   - Clicking the **Approve** link (`/api/blog-approve?token=…`).
4. Pages Function records approval + `repository_dispatch` `blog-approved`.
5. `.github/workflows/blog-on-approve.yml` scaffolds a PR.
6. Expand content → **merge PR** → deploy (existing Deploy workflow / `npm run deploy`) to publish.

## Sources of truth

| Piece | Path |
|-------|------|
| Queue | `src/data/blogSchedule.data.json` + `blogSchedule.ts` |
| CLI | `npm run blog:today` / `blog:scaffold` / `blog:upcoming` / `blog:email-body` |
| Approve API | `functions/api/blog-approve.ts` |
| Reply Worker | `workers/blog-email-inbox/` |
| D1 | `migrations/0003_blog_editorial.sql` |

## GitHub Actions secrets

| Secret | Used by |
|--------|---------|
| `BLOG_APPROVE_SECRET` | Sign/verify approve tokens; Worker → API auth |
| `CLOUDFLARE_ACCOUNT_ID` | Email Sending API |
| `CLOUDFLARE_EMAIL_API_TOKEN` | Email Sending API |
| `WORKSHOP_EMAIL_FROM` | From address (e.g. `Cloudflare Starter Hub <onboarding@orangecloud.vn>`) |

## Pages secrets / vars

| Name | Type |
|------|------|
| `BLOG_APPROVE_SECRET` | secret (same value as Actions) |
| `BLOG_GITHUB_TOKEN` | secret — PAT with `repo` scope to dispatch `blog-approved` |
| `GITHUB_REPO` | var optional — default `sycu8/cloudflare-onboarding-journey` |
| `BLOG_EDITOR_EMAIL` | var optional — default `sycu.lee@gmail.com` |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_EMAIL_API_TOKEN` / `WORKSHOP_EMAIL_FROM` | already used for workshop mail |

## Email Routing (reply APPROVE)

1. Deploy Worker: `cd workers/blog-email-inbox && npx wrangler secret put BLOG_APPROVE_SECRET && npx wrangler deploy`
2. Cloudflare Dashboard → Email Routing → rule: `blog-approve@orangecloud.vn` → Worker `blog-email-inbox`
3. Outbound editorial mail already sets `reply_to` to that inbox

Without the Worker, the **Approve link** in the email still works.

## CLI

```bash
npm run blog:today
npm run blog:upcoming
npm run blog:scaffold -- --date=2026-08-17
BLOG_APPROVE_SECRET=… npm run blog:email-body -- --date=2026-08-17
```

## Extending the queue

Add rows to `src/data/blogSchedule.data.json` (keep ≥14 days ahead, dates every **2** days).
