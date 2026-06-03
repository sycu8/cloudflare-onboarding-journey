# Maintainer review flow (PR → merge → deploy)

Repo: [github.com/sycu8/cloudflare-onboarding-journey](https://github.com/sycu8/cloudflare-onboarding-journey)

**Roles**

| Who | Does |
|-----|------|
| Contributor | Fork → branch → PR → fix CI |
| Cursor agent | Fetch PR, diff + map zones, run verification, report conflicts |
| You (maintainer) | Approve merge on GitHub, `git pull`, **commit** any local follow-ups, **`npm run deploy`** |

Contributors do **not** deploy to Cloudflare Pages.

---

## 1. When a new PR arrives

GitHub Actions runs **Verify PR** (build + smoke on preview). Check the PR checks tab first.

Ask the agent (example):

```text
Review PR #12 — fetch code, map với CONTRIBUTION_MAP, chạy verify, báo conflict với main.
```

Or run locally:

```bash
npm run review:pr -- 12
npm run review:pr -- 12 --verify   # thêm build + smoke trong worktree
```

Requires [GitHub CLI](https://cli.github.com/): `gh auth login`

---

## 2. What the agent should do

1. `git fetch origin`
2. `gh pr view <N> --json title,body,headRefName,baseRefName,files,additions,deletions`
3. `git fetch origin pull/<N>/head:pr-review-<N>`
4. `git diff origin/main...pr-review-<N> --stat` (+ file list)
5. Map each path → [CONTRIBUTION_MAP.md](./CONTRIBUTION_MAP.md) zones; flag secrets/forbidden paths
6. If `--verify`: worktree at `.worktrees/pr-<N>`, `npm ci`, `npm run build` (smoke already on PR CI)
7. Compare with **your** dirty local tree — warn if same files edited (merge conflict risk)
8. Output: **Approve / Request changes / Block** with bullet reasons

Agent must **not** `git push`, `git commit`, or `npm run deploy` unless you explicitly ask.

---

## 3. You merge and deploy

```bash
git checkout main
git pull origin main
npm ci
npm run build
npm run test:smoke    # terminal 1: npm run preview -- --port 4321 --host 127.0.0.1
npm run test:e2e      # optional, UI changes
npm run deploy
npm run deploy:verify
```

If you merged via GitHub UI only: `git pull` then deploy.

---

## 4. Conflict with local WIP

If you have uncommitted work (common while hub evolves):

```bash
git stash push -m "wip before pr-12"
npm run review:pr -- 12 --verify
git stash pop
```

Or review in a second clone / worktree only.

---

## 5. Quick decision checklist

- [ ] CI green on PR
- [ ] No secrets / `wrangler.toml` in diff
- [ ] Content changes: VI **and** EN where UI strings exist
- [ ] `src/data` JSON: intentional, not accidental huge regen
- [ ] Track/use-case links still under `/tracks/*` and `/use-cases/*`
- [ ] Smoke passes after merge locally (or trust CI)
- [ ] You run deploy
