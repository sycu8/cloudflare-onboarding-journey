# Sales content hidden while `showCommercialContent` is false

Nothing in this list is rendered, added to the sitemap, or returned by `/api/site-config` as sales copy. The flag itself is returned as `false`.

| Path | What stays out of the HTML |
| --- | --- |
| `src/pages/solutions.astro` | Solution-proposal index. Visitors are redirected to `/plans/`. |
| `src/pages/solutions/[slug].astro` | Individual proposal pages are not built. `/solutions/*` redirects to `/plans/`. |
| `src/data/solutionProposals.ts` | Proposal body (buying language, partner steering). Not rendered. |
| `src/pages/cheatsheets/cloudflare-one-enterprise-vs-paygo.astro` | Pay-as-you-go versus contract comparison. Redirects to the official Zero Trust pricing page. |
| `src/data/cloudflareOnePlans.ts` and `src/data/cloudflareOnePlans.data.json` | The comparison table and tier copy. Not rendered. |
| `src/pages/resources.astro` (`#solution-proposals`) | Card that links to the proposal index. |
| `src/data/resources.ts` (`cloudflare-one-paygo-vs-enterprise`) | Resource card marked `commercial`. Omitted from the list and from search. |

Paid success-package prices are not in this list. They were deleted. See `REMOVED_INTERNAL.md`.
