# Blog auto-review pipeline (duyệt mặc định → review → sửa → đăng)

Since 2026-11-22, schedule topics are **approved by default**. A post is
published only after an automated review against official Cloudflare sources
and [RUBRIC.md](RUBRIC.md). The review fails closed.

```
scheduled ─▶ generating ─▶ reviewing ──pass──▶ approved ─▶ PR ─▶ (merge) ─▶ published
                              │  ▲
                         fail │  │ re-review
                              ▼  │
                            fixing      (max BLOG_REVIEW_MAX_ROUNDS, default 3)
                              │
                 still failing / any error ─▶ held  (not published, editor emailed)
```

| Piece | Path |
|---|---|
| Workflow | `.github/workflows/blog-auto-publish.yml` (00:15 ICT daily + manual dispatch) |
| Orchestrator | `scripts/blog-auto.mjs` |
| Reviewer CLI | `scripts/blog-review.mjs` (`npm run blog:review -- --slug=…`, `npm run blog:audit`) |
| Rules + thresholds | `scripts/lib/blog-review/rubric.mjs`, `docs/blog/RUBRIC.md` |
| Prompts | `scripts/prompts/blog-{generate,review,fix}.md` |
| Model client | `scripts/lib/llm.mjs` (`@cf/openai/gpt-oss-*` uses `/ai/v1/responses`; other models stay on chat completions) |
| Records | `src/data/blogReviews/<slug>.claims.json` + `.review.json` |
| Tests | `npm run test:blog-review` (offline, fake models) |

## Settings (GitHub → Settings → Secrets and variables → Actions, `production` env)

| Name | Kind | Default | Meaning |
|---|---|---|---|
| `BLOG_AUTO_ENABLED` | variable | unset = **off** | Kill switch. Must be `true` for anything to run |
| `BLOG_LLM_MODEL` | variable | unset = every post held | e.g. `@cf/openai/gpt-oss-120b` or `openai/…` via Unified Billing |
| `BLOG_AI_API_TOKEN` | secret | falls back to `CLOUDFLARE_API_TOKEN` | Token with **Account › Workers AI › Read** only |
| `BLOG_AI_GATEWAY_ID` | variable | `default` for `@cf/` models | AI Gateway to route through |
| `BLOG_REVIEW_MAX_ROUNDS` | variable | `3` (1–5) | Fix/re-review rounds before `held` |
| `BLOG_AUTO_MERGE` | variable | unset = PR waits for a human merge | `true` = squash-merge + dispatch Deploy (production approval still applies) |
| `BLOG_REQUIRE_EMAIL_APPROVAL` | variable | unset | `true` restores the old email APPROVE gate (auto pipeline skips; email cron runs) |

Per-slot hold: add `"hold": true` to the item in `src/data/blogSchedule.data.json`.
Extra sources for a topic: optional `"docsHints": ["https://developers.cloudflare.com/…"]`.

## Backfill

```bash
gh workflow run "Blog auto publish" --repo sycu8/cloudflare-onboarding-journey --ref main \
  -f slug=snippets-javascript-tren-edge
```

## Fail-closed guarantees

- No model, model error, invalid model JSON → held.
- Sources not fetched / non-200 / non-official → held.
- A quote not found verbatim on the fetched page → claim unverifiable → held
  (the model can not upgrade it).
- Build, `verify:i18n`, `test:track-flow`, `test:blog-cadence` and an
  independent re-review of the written files must pass before the PR opens.
