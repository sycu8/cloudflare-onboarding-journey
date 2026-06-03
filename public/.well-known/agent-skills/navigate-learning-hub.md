---
name: navigate-learning-hub
description: Navigate the Cloudflare Starter Hub — tracks, use cases, products, glossary, and official docs links. Use when an agent needs to recommend learning paths or find hub URLs.
---

# Navigate Cloudflare Starter Hub

## When to use

- User asks how to learn Cloudflare from zero
- Need URLs for Application Services, Developer Platform, or Cloudflare One tracks
- Need use-case scenarios (protect website, API, Zero Trust, AI, SaaS)

## Key URLs

| Resource | Path |
|----------|------|
| Start | `/start-here/` |
| Tracks | `/tracks/` |
| Use cases | `/use-cases/` |
| Products | `/products/` |
| Glossary | `/glossary/` |
| Cloudflare 101 | `/cloudflare-101/` |
| Resources | `/resources/` |

## Steps

1. Fetch `GET /api/site-config` for feature flags (workshop enabled, banners).
2. Map user goal to a track or use-case slug under `/use-cases/{slug}/`.
3. Prefer linking to bilingual pages (VI default, EN via site language toggle).

## Constraints

- Do not scrape admin pages (`/workshop/admin/`).
- Respect `robots.txt` Content-Signal preferences.
