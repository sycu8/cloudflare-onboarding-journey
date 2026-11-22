# Blog quality rubric (tiêu chuẩn đánh giá bài, hình ảnh, sơ đồ)

Version `2026-11-22.1` · enforced by `scripts/lib/blog-review/` · numbers live in
`scripts/lib/blog-review/rubric.mjs` (change both in one PR).

A post is **published only when every category reaches its threshold and the
overall score is ≥ 85**. Any **blocker** sets its category to 0 → the post
fails. Scoring per category: start at 100, −25 per major, −10 per minor.

| Category | Threshold | What a pass means |
|---|---|---|
| 1. Factual accuracy & sourcing | **100** (zero tolerance) | Every Cloudflare claim is cited to an official page with a verbatim quote that code found on that page, and the model judged the quote to support the sentence in both languages |
| 2. Structure & readability | 80 | Long enough, scannable, FAQ, no placeholders |
| 3. Bilingual quality | 80 | vi (default) + en complete and equivalent; km all-or-none |
| 4. SEO basics | 80 | Title/description/keywords in range, internal links, valid slug |
| 5. Code samples | 90 | Current Wrangler/Workers syntax, parses, no future dates |
| 6. Images | 90 | Committed, light, alt text in each language, honest provenance, licensed |
| 7. Diagrams | 90 | Real product names, correct flow, legible, safe SVG, translated captions |

Severity: **blocker** = can not publish · **major** = −25 · **minor** = −10.
`(auto)` = checked by code · `(model)` = checked by the model reviewer, whose
output is schema-validated and can only *downgrade* a claim · `(human)` = spot
check when a post is held.

---

## 1. Factual accuracy & sourcing — threshold 100

Official sources only (host allow-list, https): `developers.cloudflare.com`
(incl. `/changelog/`), `blog.cloudflare.com`, `www.cloudflare.com` product /
plans / learning / trust pages (`/plans/`, `/developer-platform/`,
`/zero-trust/`, `/learning/`, `/trust-hub/`, …, locale prefixes allowed).
Not accepted: community forum, Stack Overflow, Medium, GitHub issues, third-party blogs,
model memory.

| Rule | Check | Severity |
|---|---|---|
| FACT-001 | `src/data/blogReviews/<slug>.claims.json` exists, matches schema, unique ids, each `location` exists in the post (auto) | blocker |
| FACT-002 | Every claim `sourceUrl` and every `post.sources[].href` is on the allow-list (auto) | blocker |
| FACT-003 | Every claim URL also appears in `post.sources` (auto) | major |
| FACT-004 | Any sentence with a number, unit, price, limit, ISO date or plan name (`Free plan`, `gói Free`, `$`, `ms`, `MB`, `requests`, `ngày`…) has a ledger claim at that location (auto) | blocker |
| FACT-005 | Product names exact: Cloudflare (not CloudFlare), Workers KV, AI Gateway, R2, Zero Trust… (auto) | blocker |
| FACT-006 | Sources were fetched in this review (an offline review can never pass) (auto) | blocker |
| FACT-007 | Every source URL returns HTTP 200 and redirects stay on an official host (auto) | blocker |
| FACT-008 | Each claim `quote` (≥ 20 chars) is found **verbatim** (whitespace/HTML/quote-style normalised) on its page; for docs we also read `<page>/index.md` (auto) | blocker |
| FACT-009 | Model reviewer configured, answered, and its JSON validated (fail closed) (auto) | blocker |
| FACT-010/011 | Model verdict for every claim is `supported`; `contradicted` / `outdated` / `unverifiable` blocks. Checks the vi **and** en sentence: same number, same plan/tier, no stronger wording, caveats kept (model) | blocker |
| FACT-012 | No uncited Cloudflare claims anywhere (behaviour, limits, pricing, plan availability, dates, regions, compliance) (model) | blocker |

Dates, prices and limits must match the source **exactly** (same unit, same
plan, same "up to"/"approximately"). If docs and blog disagree, docs win and
the claim cites docs. Beta/GA status and "new since" wording must cite the
changelog or docs page that states it.

## 2. Structure & readability — threshold 80

| Rule | Check | Severity |
|---|---|---|
| STR-001 | 400–2200 words per language (title, description, headings, paragraphs, FAQ) (auto) | blocker (<400) / major (>2200) |
| STR-002 | ≥ 3 sections, each with ≥ 1 paragraph (auto) | blocker / major |
| STR-003 | Paragraph ≤ 140 English words (auto) | minor |
| STR-004 | ≥ 3 FAQ entries (auto) | major |
| STR-005 | `readingMinutes` within ±3 of words/200 (auto) | minor |
| STR-006 | No placeholders: TODO, TBD, FIXME, lorem ipsum, `[[…]]`, scaffold "Sample question?" (auto) | blocker |
| STR-007 | Plain language for the level (entry = no unexplained jargon); one idea per paragraph; intro says who it is for; ends with next steps (model) | major |

## 3. Bilingual quality — threshold 80

Vietnamese is the default reader language; English is complete, not a summary.
Khmer: if any field has `km`, every field must.

| Rule | Check | Severity |
|---|---|---|
| I18N-001 | Every localized field has non-empty vi and en (auto) | blocker |
| I18N-002 | km all-or-none (auto) | major |
| I18N-003 | vi text (≥ 6 words) contains Vietnamese diacritics (auto) | blocker |
| I18N-004 | en text contains no Vietnamese (outside inline code) (auto) | major |
| I18N-005 | vi/en word ratio: whole post 0.8–2.2; paragraph (≥ 15 en words) 0.45–3.2 (auto) | major |
| I18N-006 | Same facts, numbers and caveats in vi and en; natural Vietnamese (no word-for-word calques); product names untranslated (model) | blocker if facts differ, else major |

## 4. SEO basics — threshold 80

| Rule | Check | Severity |
|---|---|---|
| SEO-001 | Slug lowercase-hyphen, ≤ 70 chars, unique (auto) | blocker |
| SEO-002 | Title 20–80 chars per language (auto) | major |
| SEO-003 | Description 70–200 chars per language (auto) | major |
| SEO-004 | 3–10 comma-separated keywords per language (auto) | minor |
| SEO-005 | ≥ 2 internal `hubLinks`; every `relatedPostSlugs` exists (auto) | major |
| SEO-006 | Each source has a readable title (auto) | minor |
| SEO-007 | Primary keyword appears in title and first paragraph; headings are questions/benefits, not "Section 1" (model) | minor |

## 5. Code samples — threshold 90

| Rule | Check | Severity |
|---|---|---|
| CODE-001 | No outdated syntax: `wrangler publish`, `wrangler generate`, `node_compat`, `usage_model`, Wrangler v1 `type =`, Workers Sites `[site]`, service-worker `addEventListener('fetch')` (auto) | blocker |
| CODE-002 | `compatibility_date` is a real date not after the review date (auto) | blocker |
| CODE-003 | Code fences closed; `codeSamples[]` have `lang` + `code` (auto) | major |
| CODE-004 | JSON/JSONC samples parse (auto) | blocker |
| CODE-005 | Config shown as `wrangler.jsonc` first (Cloudflare recommends it for new projects; TOML optional); ES module Workers; bindings match the prose; commands copy-paste runnable; no secrets/real account ids (model) | major (secret = blocker) |

## 6. Images — threshold 90

| Rule | Check | Severity |
|---|---|---|
| IMG-001 | Committed under `public/images/blog/` or `public/ref-diagrams/`; file exists; no hotlinks (auto) | blocker |
| IMG-002 | Format webp, avif, png, jpg or svg (auto) | blocker |
| IMG-003 | Size ≤ 300 KB raster, ≤ 150 KB SVG (auto) | major |
| IMG-004 | Alt text in vi and en (and km when the post has km), 8–160 chars, descriptive (not the file name, not "image 1") (auto) | blocker |
| IMG-005 | `provenance` set: `dashboard-capture`, `official-diagram`, `original-diagram`, `illustration` (ref-diagrams exempt) (auto) | blocker |
| IMG-006 | Anything that looks like the Cloudflare dashboard must be a **real** capture (`dashboard-capture`). No generated or mocked dashboard UI (auto + model) | blocker |
| IMG-007 | Dashboard capture has a credit line in vi and en; no account email, zone, IP or token visible (auto + human) | major (leak = blocker) |
| IMG-008 | `illustration` has a `license` (own work / CC0 / CC BY with attribution) (auto) | blocker |
| IMG-009 | Image matches the paragraph it sits next to; ≥ 1200 px wide for raster hero, ≥ 800 px inline (model/human) | major |

## 7. Diagrams — threshold 90

Prefer official Reference Architecture diagrams (`diagramSlugs` →
`public/ref-diagrams/`). An original diagram is an SVG rendered from a
committed Mermaid (`.mmd`) or D2 source.

| Rule | Check | Severity |
|---|---|---|
| DIA-001 | Every `diagramSlugs` / `sections[].diagramSlug` exists in `referenceDiagrams.data.json` (auto) | blocker |
| DIA-002 | SVG has no `<script>`, event handlers or `javascript:` (auto) | blocker |
| DIA-003 | SVG has `viewBox` and a `<title>` (auto) | major |
| DIA-004 | No text under 11 px (auto) | major |
| DIA-005 | Product names in labels pass FACT-005 (auto) | blocker |
| DIA-006 | `.mmd`/`.d2` source committed next to the SVG (auto) | minor |
| DIA-007 | Labels language-neutral (product names, arrows, icons) and marked `labelsLanguageNeutral` after checking (auto flag + human) | major |
| DIA-008 | vi and en caption explains the data flow (auto) | major |
| DIA-009 | Data flow is correct: request direction, which product runs where (edge vs origin), bindings vs public internet, no invented products (model) | blocker |

---

## Review output (machine-checkable)

Each round writes a report that must validate against
`docs/blog/review-report.schema.json` (JSON Schema 2020-12; generated from
`scripts/lib/blog-review/schema.mjs`). Shape:

```json
{
  "schemaVersion": 1,
  "rubricVersion": "2026-11-22.1",
  "slug": "snippets-javascript-tren-edge",
  "date": "2026-11-22",
  "round": 2,
  "reviewedAt": "2026-11-22T17:20:11.000Z",
  "reviewer": { "deterministic": true, "model": "@cf/openai/gpt-oss-120b", "network": true },
  "verdict": "pass",
  "overallScore": 96,
  "categories": { "factual": { "score": 100, "threshold": 100, "pass": true }, "...": {} },
  "claims": [
    { "id": "C1", "text": "…", "location": "s1.p0", "sourceUrl": "https://developers.cloudflare.com/rules/snippets/",
      "quote": "…verbatim…", "quoteFound": true, "verdict": "supported" }
  ],
  "findings": [
    { "rule": "SEO-004", "category": "seo", "severity": "minor", "message": "…", "location": "keywords", "fix": "…" }
  ],
  "sourcesChecked": [ { "url": "https://developers.cloudflare.com/rules/snippets/", "official": true, "status": 200 } ]
}
```

The model reviewer returns a smaller object validated against
`LLM_REVIEW_SCHEMA` (`claims[{id, verdict, note}]`, `uncitedClaims[{location, text}]`,
`findings[{category, severity, message, location, fix}]`). Anything that fails
validation is a FACT-009 blocker.
