# Cloudflare `cf` CLI

This hub uses **[`cf`](https://github.com/cloudflare/cf)** — Cloudflare’s agentic CLI for the full API — for maintainer scripts that talk to the Cloudflare API (DNS-AID, Access, account introspection). Wrangler remains the tool for **Pages local preview, D1/R2 local seed, and `npm run deploy`**.

## Install

```bash
npm install          # cf is a devDependency
# or globally: npm i -g cf
```

## Auth

```bash
# Preferred in CI / Cloud Agents (already used by this repo):
export CLOUDFLARE_API_TOKEN=...

# Or interactive:
npx cf auth login
npx cf auth whoami
```

`npm run cf:whoami` is a shortcut for `npx cf auth whoami`.

## Agent discovery

Do **not** chain nested `--help`. Discover commands with:

```bash
npx cf cli search "list DNS records"
npx cf schema dns records list
npx cf dns records list -z orangecloud.vn --type TXT
```

Keep search queries anonymous (no account IDs, domains, or tokens in the query string).

## Scripts that use `cf`

| Script | npm | What it does |
|--------|-----|----------------|
| `scripts/setup-dns-aid.mjs` | `npm run dns-aid:setup` | Create DNS-AID HTTPS/TXT records via `cf dns` |
| `scripts/setup-workshop-admin-access.mjs` | `npm run access:workshop-admin` | Ensure Access apps/policies via `cf zero-trust access` |
| `scripts/lib/cf.mjs` | — | Shared wrapper (`cf()`, `cfBody()`, `ensureCfAuth()`) |

## Common API equivalents

| Task | `cf` |
|------|------|
| Who am I? | `npx cf auth whoami` |
| List zones | `npx cf zones list` |
| List Pages projects | `npx cf pages projects list` |
| List D1 | `npx cf d1 list` |
| Create KV namespace | `npx cf kv namespaces create --title SITE_CONFIG` |
| Create R2 bucket | `npx cf r2 buckets create --name cloudflare-starter-hub-resources` |
| Access apps | `npx cf zero-trust access applications list` |

Local Workers/Pages simulation (`pages dev`, local D1/R2 object put) still uses **Wrangler** — see [AGENTS.md](../AGENTS.md) and [README.md](../README.md).
