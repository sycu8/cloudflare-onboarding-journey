# auth.md — Cloudflare Starter Hub

Agent and automation clients can use this hub as a **read-mostly** learning site. Write APIs are limited and documented below.

## Audience

- **Read-only agents**: `GET /api/site-config`, `GET /api/workshop-events` — no registration required.
- **Admin automation**: workshop event management requires a Bearer token (`WORKSHOP_ADMIN_KEY`) issued out-of-band to maintainers.

## Registration

**agent_auth** (machine-readable): register at `https://onboarding.orangecloud.vn/.well-known/oauth/register`, claim at `https://onboarding.orangecloud.vn/.well-known/oauth/agent-claim`.

Anonymous agent identity (no PII):

1. `POST https://onboarding.orangecloud.vn/.well-known/oauth/register` with body `{"client_name":"your-agent"}` → returns `client_id`.
2. `POST https://onboarding.orangecloud.vn/.well-known/oauth/agent-claim` with `{"client_id":"<client_id>"}` → anonymous bearer context for `hub.read`.
3. Protected resource metadata: [`/.well-known/oauth-protected-resource`](https://onboarding.orangecloud.vn/.well-known/oauth-protected-resource).
4. Authorization server (includes `agent_auth` block): [`/.well-known/oauth-authorization-server`](https://onboarding.orangecloud.vn/.well-known/oauth-authorization-server).

Supported identity: `anonymous`. Credential type: `bearer` (read-only hub APIs without token; `workshop.admin` requires maintainer key).

## Credentials

| Scope | Method | Notes |
|-------|--------|-------|
| `hub.read` | None | Public GET endpoints |
| `workshop.admin` | `Authorization: Bearer <WORKSHOP_ADMIN_KEY>` | Maintainer-only; request from site operators |

## Discovery

- API catalog: [`/.well-known/api-catalog`](https://onboarding.orangecloud.vn/.well-known/api-catalog)
- OpenAPI: [`/.well-known/openapi.json`](https://onboarding.orangecloud.vn/.well-known/openapi.json)
- Agent skills: [`/.well-known/agent-skills/index.json`](https://onboarding.orangecloud.vn/.well-known/agent-skills/index.json)
- MCP card: [`/.well-known/mcp/server-card.json`](https://onboarding.orangecloud.vn/.well-known/mcp/server-card.json)
