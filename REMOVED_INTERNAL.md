# Removed because the source was not public

No removed paragraphs are copied here.

| Path | Why it was removed |
| --- | --- |
| `src/pages/cheatsheets/enterprise-support-success-packages.astro` | Page existed to show paid success-package prices and response times. Replaced with a 301 to `https://www.cloudflare.com/plans/`. |
| `src/data/enterpriseSuccessPackages.ts` | Data for that page, including a non-public solution-brief citation. |
| `src/data/enterpriseSuccessPackages.data.json` | Same table. |
| `src/components/interactive/EnterpriseSuccessPackagesTable.tsx` | Renderer for that table. |
| `src/data/enterprise.ts` (previous copy) | Page copy that repeated those prices and partner-steering claims. Replaced with a short public-plan explainer. |
| `src/data/cloudflarePlans.data.json` | Zone feature matrix generated from a non-public spreadsheet. |
| `scripts/generate-plans-from-xlsx.mjs` | Script that imported that spreadsheet. |
| `src/data/cf101Terminology.ts` (previous entries) | Glossary introduced as non-public training notes. Rebuilt with a public URL on each remaining term. Terms without a public page were dropped. |
| `docs/imports/*.txt` | Raw notes that fed that glossary and the setup guide. |
| `src/data/cloudflareOnePlans.data.json` (one note) | A support-response sentence that pointed at the deleted price table. Replaced with a pointer to the public pricing page. |
| `src/data/cloudflareOnePlans.ts` (one row) | A paid-success add-on row with a contract-value percentage. Deleted. |

`/plans` no longer prints the spreadsheet matrix. It links to `https://www.cloudflare.com/plans/` and `https://developers.cloudflare.com/fundamentals/account-and-billing/`.
