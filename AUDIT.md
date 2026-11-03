# Audit (Phase 0 notes + this change)

Stack: Astro 6 static site on Cloudflare Pages, with Pages Functions in `functions/` for `/api/*`. Vietnamese, English, and Khmer are three copies in the same HTML. The language switcher sets `html[data-lang]` and CSS shows one `.lang-*` block. Content lives in `src/data/*.ts` and `src/data/*.json`, pages in `src/pages/`. Progress uses `localStorage` (`cfhub_language` and existing progress keys).

Public APIs: `/api/site-config`, `/api/workshop-events`, `/api/workshop-signup`, `/api/feedback`, `/api/quiz-submission`, `/api/generate`, `/api/search`, plus admin and OAuth routes. Status data now comes from `/api/cloudflare-status`, which reads `www.cloudflarestatus.com`.

## What this change covers

The first ship is trust and privacy, aimed at `https://onboarding-uat.orangecloud.vn/`:

- Paid success-package prices and response-time tables are deleted. The old cheatsheet redirects to the public plans page.
- Other sales pages (solution proposals, Zero Trust pay-as-you-go comparison, contact-sales links) stay in source behind `showCommercialContent` (default `false`) and are not rendered.
- The zone plan matrix that came from a non-public spreadsheet is no longer published. `/plans` points at `https://www.cloudflare.com/plans/`.
- The Cloudflare 101 glossary is rebuilt from public docs, with a source link on each term. Raw import notes under `docs/imports/` are deleted.
- Personal name, phone numbers, and personal profile links are removed from pages, JSON-LD, and `llms.txt`. The publisher is the Orange Cloud organization. The “Not a publication of Cloudflare, Inc.” line stays.
- The status page loads official incidents only. A failed fetch shows the fallback sentence and no old incidents.
- Every page shows a Khmer AI-translation notice and a Read in English button when Khmer is selected.

## Not in this change

Lighthouse and axe were not run in this pass. Per-locale URLs, the entitlements file, the single front door, and the rest of phases 2–6 are still open. See `REVIEW_NEEDED.md`.

## TODO(verify)

- Native-speaker review of the Khmer notice.
- Whether `hello@orangecloud.vn` should become the public contact. It is not published yet.
- Statuspage JSON paths (`/api/v2/summary.json` and `/api/v2/incidents.json`) were checked against the live host on 3 Nov 2026 (Asia/Singapore). Re-check if Cloudflare changes the API catalog.
