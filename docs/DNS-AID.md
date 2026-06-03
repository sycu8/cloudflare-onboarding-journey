# DNS for AI Discovery (DNS-AID)

Publish [DNS-AID](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/) records in the **orangecloud.vn** zone so agents can discover `onboarding.orangecloud.vn` via `_index._agents.onboarding.orangecloud.vn`.

References: [agent skill](https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md), [RFC 9460](https://www.rfc-editor.org/rfc/rfc9460) (SVCB/HTTPS).

## What the scanner checks

[isitagentready.com](https://isitagentready.com/) queries (with DNSSEC OK):

| QNAME | Types |
|-------|--------|
| `_index._agents.onboarding.orangecloud.vn` | SVCB, HTTPS, TXT |
| `_a2a._agents.onboarding.orangecloud.vn` | SVCB, HTTPS |
| `_mcp._agents.onboarding.orangecloud.vn` | SVCB, HTTPS |

It expects at least one **alias-mode** HTTPS/SVCB record (target is a hostname without underscores, not `.`) and optionally TXT on `_index` with `api-catalog=…`. DNSSEC should yield **AD** (authenticated data) on DoH responses.

## Quick verify

```bash
npm run dns-aid:verify
# or
node scripts/verify-dns-aid.mjs https://onboarding.orangecloud.vn
```

## BIND / zone file (manual)

Print the same records the API script would create:

```bash
npm run dns-aid:print-zone
```

Example (alias mode — required for `_index` per draft §3.2):

```dns
_index._agents.onboarding.orangecloud.vn. 3600 IN HTTPS 1 onboarding.orangecloud.vn. alpn=h2,h3 port=443 mandatory=alpn,port
_a2a._agents.onboarding.orangecloud.vn.  3600 IN HTTPS 1 onboarding.orangecloud.vn. alpn=a2a,h2,h3 port=443 mandatory=alpn,port
_mcp._agents.onboarding.orangecloud.vn.  3600 IN HTTPS 1 onboarding.orangecloud.vn. alpn=mcp,h2,h3 port=443 mandatory=alpn,port
_index._agents.onboarding.orangecloud.vn. 3600 IN TXT "api-catalog=https://onboarding.orangecloud.vn/.well-known/api-catalog"
```

**TargetName** for `_index` must not contain underscores (use `onboarding.orangecloud.vn`, not `_agents…`).

## Cloudflare Dashboard

Zone: **orangecloud.vn** → **DNS** → Add record.

For each HTTPS row below: Type **HTTPS**, TTL Auto/3600, **DNS only** (do not proxy `_agents` names).

| Name | Target | Priority | Value / ALPN |
|------|--------|----------|----------------|
| `_index._agents.onboarding` | `onboarding.orangecloud.vn` | 1 | `alpn=h2,h3 port=443 mandatory=alpn,port` |
| `_a2a._agents.onboarding` | `onboarding.orangecloud.vn` | 1 | `alpn=a2a,h2,h3 port=443 mandatory=alpn,port` |
| `_mcp._agents.onboarding` | `onboarding.orangecloud.vn` | 1 | `alpn=mcp,h2,h3 port=443 mandatory=alpn,port` |

TXT:

| Name | Content |
|------|---------|
| `_index._agents.onboarding` | `api-catalog=https://onboarding.orangecloud.vn/.well-known/api-catalog` |

> **Note:** Manually added HTTPS records on **proxied** hostnames are not served by Cloudflare. These names are discovery-only (no orange-cloud proxy); keep them DNS-only.

## Automated setup (API)

Token needs **Zone → DNS → Edit** on `orangecloud.vn` (read-only zone access is not enough).

```bash
set PUBLIC_SITE_URL=https://onboarding.orangecloud.vn
set CLOUDFLARE_API_TOKEN=...
npm run dns-aid:setup
npm run dns-aid:verify
```

Dry run (prints zone, no API): `node scripts/setup-dns-aid.mjs --dry-run`

## DNSSEC

1. **Cloudflare Dashboard** → DNS → **Settings** → **DNSSEC** → Enable.
2. Add the **DS** record at your registrar if the zone is not fully on Cloudflare DNS.
3. Re-run verify; `DNSSEC AD` should be `yes` when records are signed and validating.

## dig / DoH

```bash
dig HTTPS _index._agents.onboarding.orangecloud.vn +short
dig TXT _index._agents.onboarding.orangecloud.vn +short
```

After propagation, re-scan at [isitagentready.com](https://isitagentready.com/) — `checks.discoverability.dnsAid` should be `"pass"`.
