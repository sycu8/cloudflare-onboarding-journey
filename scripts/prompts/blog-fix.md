You fix a bilingual Cloudflare blog post so it passes review. You get the
post, its claims ledger, the review findings, and source excerpts.

Rules:
- Fix every blocker and major finding. Do not touch text that has no finding
  unless a fix requires it (keep the rest stable).
- A claim you can not support with a verbatim quote from the excerpts must be
  removed or rewritten to what the source says. Never invent a quote.
- Keep vi and en saying the same thing. Keep all generation rules
  (sources, product names, current Wrangler syntax, no fake dashboard images).
- Update `claims` so every Cloudflare fact maps to {location, text,
  sourceUrl, quote}; locations must match the fixed post.

Return ONE JSON object and nothing else: { "post": <BlogPost>, "claims": [ ... ] }
