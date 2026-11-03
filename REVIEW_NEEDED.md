# Decisions for a human

## TODO(verify)

1. **Khmer notice.** The banner uses the requested Khmer and English sentences. A native speaker should confirm the Khmer. Until then it is marked AI-translated on every Khmer view.
2. **Public mailbox.** JSON-LD uses the organization name Orange Cloud and `https://orangecloud.vn/`. A shared mailbox such as `hello@orangecloud.vn` is not on the site until someone confirms it exists.
3. **Admin and editor mailboxes.** Workshop admin and the blog approval mail still default to the existing operator address in server code. That address is not printed on public pages. Confirm whether it should move to a shared mailbox.
4. **Tutorial licence.** Tutorial pages are translated from Cloudflare docs. The docs licence was not re-confirmed in this change. Add the attribution line after a human records the licence.
5. **robots.txt.** `public/robots.txt` sets `Content-Signal: ai-input=no` while `llms.txt` and the agent APIs invite assistants to read the site. Pick one direction.
6. **Privacy page.** Workers AI prompts, Luma, retention, and Vietnam Decree 13/2023 still need legal wording. Do not treat the current privacy page as that review.
7. **Plan facts.** Lessons may still disagree with `cloudflare.com/plans`. The matrix was removed rather than republished. A later change should store only rows that cite a public URL.

## Commercial switch

`src/lib/siteFlags.mjs` exports `showCommercialContent`. It is `false`. Set it to `true` and rebuild to show the sales pages again.
