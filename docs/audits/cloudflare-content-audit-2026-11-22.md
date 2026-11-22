# Cloudflare Starter Hub — content accuracy audit (2026-11-22)

> **Status:** Review proposal only. No production page, deployment setting, or workflow has been changed.
> **Scope:** Public home page, tracks, blog listing and sampled first-party articles on `main` as of 2026-11-22. Repository inventory: 560 tracked blobs in retrieved recursive tree (`a5eb090386c4a024a22c8c2eb139d0a4057d0ba0`, a **tree SHA**, not a commit SHA). This is NOT yet a full verification of every lesson, translated string, code sample, or all 244 synced tutorials.
> **Evidence:** Source file paths plus official Cloudflare developer documentation linked below.

## Confirmed corrections / important qualifications

| ID | Priority | Source and current claim | Problem and proposed replacement | Official evidence |
|---|---|---|---|---|
| CF-01 | P1 | `src/data/blogPosts/pages-vs-workers-khi-nao-dung.ts:38-39` recommends Pages first for new portfolio/blog/static websites, without noting the updated default | Rewrite comparison: **Workers Static Assets is Cloudflare's recommendation for new static, SPA and full-stack applications**; Pages remains supported for existing projects. Preserve Pages as a valid deployed platform, not deprecated. Update intro, all relevant comparisons, FAQ and bilingual text. | https://developers.cloudflare.com/workers/best-practices/workers-best-practices/ |
| CF-02 | P1 | `src/data/blogPosts/kv-key-value-edge-khi.ts:55-56` suggests KV for simple rate-limit counters and lightweight sessions/tokens | KV is eventually consistent and lacks atomic counters. Remove KV as an unqualified recommendation for enforcement counters and session state requiring revocation/strong consistency. Compare Workers Rate Limiting binding (approximate, per location), strict-limit options, and Durable Objects for coordinated state. Keep KV valid for noncritical configuration and read-heavy preferences. | https://developers.cloudflare.com/kv/reference/faq/ ; https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ |
| CF-03 | P1 | `src/data/blogPosts/kv-key-value-edge-khi.ts:79-80,126-127` states propagation can take only 'a few seconds' | Replace with: reads from other locations **can return stale data for up to 60 seconds or more depending on cache TTL and prior negative caching**. Explain no global read-after-write guarantee. Amend both VI and EN paragraphs and FAQ. | https://developers.cloudflare.com/kv/concepts/how-kv-works/ |
| CF-04 | P2 | `src/data/blogPosts/d1-sqlite-edge-cho-app.ts:19-20` and `src/data/blogPosts/kv-key-value-edge-khi.ts:75-76` say 'SQLite at the edge' | This can imply every D1 read/write is always executed at the request's nearest edge. Clarify D1 has a primary DB location; optional global read replicas are read-only, require use of **Sessions API** for read replication, and writes go to primary. | https://developers.cloudflare.com/d1/best-practices/read-replication/ |
| CF-05 | P2 | `src/data/blogPosts/ai-gateway.ts` is a generic AI Gateway introduction, but lacks significant current operational prerequisites | Add dated callout: gateways created since 2026-11-03 require authentication; old unauthenticated gateways can remain but should be secured. Clarify logs enabled by default and Workers Logs pricing/retention applies to new customers whose first gateway was created on/after 2026-09-24. Do not state all AI Gateway logging is free. | https://developers.cloudflare.com/ai-gateway/changelog/ ; https://developers.cloudflare.com/ai-gateway/observability/logging/ ; https://developers.cloudflare.com/ai-gateway/reference/pricing/ |
| CF-06 | P2 | Homepage `/` describes tutorial catalog: '244 items (synced 2026-06-03)' | This is an out-of-date **freshness indication**, not proof the item count is wrong. Check current catalog generation source and sync job; display actual last successful sync, add an explicit 'as of' date and stale-data warning when overdue; do not claim tutorials are fully current. | Site: https://onboarding.orangecloud.vn/ |
| CF-07 | P2 | `src/data/blogPosts/pages-vs-workers-khi-nao-dung.ts` describes the combined Pages frontend + Worker backend as the main learning pattern | Keep it as a supported pattern, but add a Workers-only full-stack application with static assets and bindings as a first-class modern architecture; do not imply Pages Functions and Workers are fundamentally different runtimes. | https://developers.cloudflare.com/workers/best-practices/workers-best-practices/ |

## Checked; do not 'fix' without new evidence

- **Cloudflare WAN** nomenclature on `/start-here/` matches the 2026 official naming, including 'formerly Magic WAN'. Source: https://developers.cloudflare.com/changelog/post/2026-02-17-product-name-updates/
- **Cloudflare Email Sending** pricing values sampled in `src/data/blogPosts/email-routing-va-email-workers.ts` (Workers Paid: 3,000 included sends per account/month, $0.35 per 1,000 beyond, free to verified destinations) align with official pricing at review time: https://developers.cloudflare.com/email-service/platform/pricing/
- The existing Pages-based hosting of this repository is **not** itself a defect; recommendation for *new applications* is not a requirement to migrate existing production.

## Proposed correction sequence — subject to owner approval

1. **P1 correctness:** Update VI and EN editorial content for CF-01, CF-02 and CF-03. Add content regression tests verifying required caveats.
2. **P2 nuance:** Update D1 and Workers architecture examples CF-04 and CF-07, distinguishing primary, read replicas, Sessions API and Workers Static Assets.
3. **P2 freshness:** Update AI Gateway security/logging CF-05; surface source dates for cost and plan limitations.
4. **P2 catalog freshness:** Trace resource sync source, count and timestamps before changing CF-06. Avoid hardcoded fresh dates.
5. **Coverage expansion:** Inventory every page/track/use-case/blog article, all VI/EN/KM translations, generated catalogs, pricing statements, commands, retired product names, diagrams, citations, and links; track a status per claim: confirmed, outdated, misleading, unverified. Separate retrieved official tutorial text from original editorial claims.
6. **QA before merge:** build, content-specific assertions, smoke tests, link checks and mobile/UI regression on UAT. Review the concrete content diff with the owner. No automatic merge/deploy.

## Acceptance criteria

- Every corrected material technical claim has a direct `developers.cloudflare.com` URL and a last-verified date.
- VI/EN (and KM when supported in the page) convey equivalent caveats, not misleading omissions.
- No new static claim of exact fees/limits without official reference and verification date.
- Tests distinguish pages/code samples/FAQ, not only hero text.
- Existing tutorials continue to render, navigate and link correctly.
- Owner approves **the implementation diff** before merge/deploy.

## Coverage limits / status

- **Inspected:** selected public landing and track pages, blog index, individual article source files above, repository tree, deployment workflow triggers; checked cited official docs.
- **Not inspected exhaustively:** all 560 blobs, every content-data module, all 244 resource entries, all multilingual translations, live-browser interactive flows, external links and production deployment state.
- **Validation:** no local build, test suite or browser automation was executed. This audit-only PR deliberately contains no production code changes.
