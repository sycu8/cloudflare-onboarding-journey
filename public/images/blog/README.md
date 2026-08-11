# Blog images & Dashboard screenshots

Blog posts prefer **official Cloudflare Reference Architecture** diagrams already in
`public/ref-diagrams/` (wired via `diagramSlugs` on each post).

## Add a Dashboard screenshot

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Open the relevant product screen (WAF, Caching, Workers, AI Gateway, …).
3. Capture a clean screenshot (hide personal account email / zone names if needed).
4. Save under this folder, e.g.:

```text
public/images/blog/waf-overview.webp
public/images/blog/workers-overview.webp
```

5. Reference it on the post:

```ts
images: [
  {
    src: '/images/blog/waf-overview.webp',
    alt: {
      vi: 'Cloudflare Dashboard — tổng quan WAF',
      en: 'Cloudflare Dashboard — WAF overview',
    },
    caption: {
      vi: 'Ví dụ giao diện Security → WAF trên Dashboard.',
      en: 'Example Security → WAF view in the Dashboard.',
    },
    credit: {
      vi: 'Ảnh chụp từ Cloudflare Dashboard (học tập).',
      en: 'Screenshot from the Cloudflare Dashboard (for learning).',
    },
  },
],
```

Or attach mid-article via `sections[].image`.

## Prefer diagrams when possible

Use `diagramSlugs` from `src/data/referenceDiagrams.ts` / `npm run diagrams:sync` —
they are licensed for this hub and already cached with long TTL.
