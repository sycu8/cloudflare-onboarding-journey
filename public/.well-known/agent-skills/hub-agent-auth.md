---
name: hub-agent-auth
description: Authenticate automation against Cloudflare Starter Hub admin APIs using OAuth discovery metadata and Bearer tokens.
---

# Hub agent authentication

## Discovery

- Authorization server: `/.well-known/oauth-authorization-server`
- Protected resource: `/.well-known/oauth-protected-resource`
- Human guide: `/auth.md`

## Anonymous registration

1. `POST /.well-known/oauth/register` with JSON `{"client_name":"my-agent"}`.
2. Store returned `client_id` for optional `POST /.well-known/oauth/agent-claim`.

## Admin writes

`POST /api/workshop-events` requires:

```
Authorization: Bearer <WORKSHOP_ADMIN_KEY>
```

Obtain keys only from site maintainers — never commit secrets.

## Scopes

| Scope | Access |
|-------|--------|
| `hub.read` | Public GET APIs |
| `workshop.admin` | Workshop event CRUD |
