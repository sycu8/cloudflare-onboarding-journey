# Blog review records

One pair of files per auto-published post (written by `scripts/blog-auto.mjs`):

- `<slug>.claims.json` — claims ledger: every Cloudflare fact in the post →
  `{ id, location, text, sourceUrl, quote }`. `quote` is copied verbatim from
  the official page and is re-checked by code on every review.
- `<slug>.review.json` — the last passing review report
  (schema: `docs/blog/review-report.schema.json`, rubric: `docs/blog/RUBRIC.md`).

Re-run a review: `npm run blog:review -- --slug=<slug>` (add `--model` for the model pass).
Posts published before 2026-11-22 have no ledger yet; `npm run blog:audit` lists their gaps.
