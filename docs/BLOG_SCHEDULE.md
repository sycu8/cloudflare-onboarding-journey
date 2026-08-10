# Blog daily schedule

Cadence: **one bilingual post per day** (calendar `Asia/Ho_Chi_Minh`).

## Sources of truth

| Piece | Path |
|-------|------|
| Published posts | `src/data/blog.ts` + `src/data/blogPosts/*` |
| Upcoming queue | `src/data/blogSchedule.ts` |
| Daily GitHub issue | `.github/workflows/blog-daily.yml` (cron `5 17 * * *` UTC ≈ 00:05 ICT) |
| CLI | `npm run blog:today` / `blog:scaffold` / `blog:issue` / `blog:upcoming` |

## Maintainer flow (each day)

1. Workflow opens (or bumps) issue `Blog daily YYYY-MM-DD: <slug>` with generate prompt.
2. Agent or human: `npm run blog:scaffold -- --date=YYYY-MM-DD`
3. Write full `{ vi, en }` content (≥400 words/lang), FAQ, sources, hub backlinks.
4. Import post in `src/data/blog.ts`; add smoke route if new slug pattern needed.
5. PR → merge → `npm run deploy` (maintainer).

## Extending the queue

Add objects to `blogScheduleQueue` in `src/data/blogSchedule.ts` (rotate topics: CDN → Security → Workers → AI → Developer Platform). Keep at least **14 days** ahead.

```bash
npm run blog:upcoming
```

## Manual trigger

GitHub → Actions → **Blog daily generate** → Run workflow (optional date override).
