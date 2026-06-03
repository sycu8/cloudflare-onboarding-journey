# Agent instructions (maintainer + contributions)

## Default role

You help the **maintainer** integrate external contributions safely. Contributors open PRs on GitHub; **only the maintainer** merges and runs `npm run deploy`.

## When the user asks to review a PR

1. Run `npm run review:pr -- <number>` (needs `gh auth login`).
2. Read output: zone mapping, forbidden files, overlap with local uncommitted files.
3. Optionally `npm run review:pr -- <number> --verify` for worktree build.
4. Read `git diff origin/main...pr-review-<number>` for logic/content review.
5. Cross-check [docs/CONTRIBUTION_MAP.md](docs/CONTRIBUTION_MAP.md) and [docs/MAINTAINER_REVIEW.md](docs/MAINTAINER_REVIEW.md).
6. Report: **Approve** | **Request changes** | **Block** with concrete file/line risks (routing, i18n, secrets, track links, JSON churn).

## Do not unless explicitly asked

- `git commit`, `git push`, merge PRs on GitHub
- `npm run deploy` or change Cloudflare dashboard secrets
- Amend contributor branches

## Merge + deploy (maintainer only)

After user merges on GitHub: `git pull origin main` → `npm run build` → `npm run test:smoke` (with preview) → `npm run deploy` → `npm run deploy:verify`.

## Project conventions

- Bilingual `{ vi, en }` for user-facing copy
- No secrets in repo; `wrangler.toml` is local-only
- Minimize scope; match existing Astro/React patterns in `src/`
