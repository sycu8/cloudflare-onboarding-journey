---
name: hub-public-api
description: Call Cloudflare Starter Hub public APIs — site config and workshop events. Use for automation that reads hub state without admin credentials.
---

# Hub public API

## OpenAPI

`GET /.well-known/openapi.json`

## Endpoints

### `GET /api/site-config`

Returns `{ ok, workshopEnabled, resourceDownloadsEnabled, announcementBanner }`.

Cache: short TTL at edge; safe to poll infrequently.

### `GET /api/workshop-events`

Returns published workshop events (bilingual titles/descriptions).

## Rate limits

Write endpoints (`POST /api/feedback`, signup, quiz) are rate-limited per IP. Prefer read-only GET for agents.

## Errors

- `429` — rate limited; back off
- `503` — KV/D1 not configured (preview environments)
