# AI Search setup

Cloudflare Starter Hub supports **two search modes**:

| Mode | How | Requires |
|------|-----|----------|
| **Instant search** | Keyword match on `public/search-index.json` (built every deploy) | Nothing — works out of the box |
| **AI Search** | Hybrid semantic + keyword via [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/) | AI Search instance + Pages binding |

UI: navbar search (Ctrl+K) and `/search/`.

## 1. Create an AI Search instance

1. Open [AI Search](https://dash.cloudflare.com/?to=/:account/ai/ai-search) in the Cloudflare dashboard.
2. **Create AI Search** → data source **Website**.
3. Site URL: `https://onboarding.orangecloud.vn` (or UAT URL).
4. Sitemap: `https://onboarding.orangecloud.vn/sitemap-index.xml`  
   (Settings → Parsing → **Specific sitemaps** if you only want hub pages.)
5. Optional content selector: `main` or `.container` to skip chrome.
6. Instance name: `cloudflare-starter-hub` (or update `wrangler.toml`).

Run **Sync** and wait until indexed items appear.

## 2. Bind to Pages

Copy `wrangler.toml.example` → `wrangler.toml` and ensure:

```toml
[[ai_search]]
binding = "HUB_SEARCH"
instance_name = "cloudflare-starter-hub"
```

Redeploy Pages. Verify:

```bash
curl https://onboarding.orangecloud.vn/api/search
# { "ok": true, "aiSearchEnabled": true, ... }
```

## 3. API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/search` | GET | Status (`aiSearchEnabled`) |
| `/api/search` | POST | AI Search — body `{ "q": "WAF best practices", "lang": "vi", "mode": "ai" }` |

Rate limit: 30 requests/minute per IP (KV `SITE_CONFIG`).

## 4. Local dev

Add `remote = true` on the `ai_search` binding to proxy to the deployed instance during `wrangler pages dev`.

## 5. Re-index after deploy

AI Search crawls from sitemap. After large content changes:

- Dashboard → instance → **Sync**, or
- Reindex individual URLs under **Indexed Items**.

Instant search index rebuilds automatically on every `npm run build`.
