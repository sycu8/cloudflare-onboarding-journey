#!/usr/bin/env node
/**
 * Review one committed blog post against docs/blog/RUBRIC.md.
 *
 *   node --experimental-strip-types scripts/blog-review.mjs --slug=<slug> [--offline] [--model] [--write]
 *   node --experimental-strip-types scripts/blog-review.mjs --audit        # deterministic checks, all posts, never fails
 *
 * Exit 0 = pass, 3 = fail (fail closed), 1 = usage/runtime error.
 * Needs src/data/blogReviews/<slug>.claims.json. --offline can never pass
 * (sources must be fetched); use it to see the other findings.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runDeterministicChecks } from './lib/blog-review/checks.mjs';
import { createModels } from './lib/blog-review/models.mjs';
import { buildCheckContext, ledgerPath, loadPostBySlug, publishedSlugs, readJsonIfExists, reportPath, writeJson } from './lib/blog-review/repo.mjs';
import { reviewPost } from './lib/blog-review/review.mjs';
import { cachedSourceFetcher, httpFetchText } from './lib/blog-review/sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function todayVn() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function audit() {
  const ctx = buildCheckContext(root, { today: todayVn(), allowExistingSlug: true });
  const rows = [];
  for (const slug of [...publishedSlugs(root)].sort()) {
    const loaded = await loadPostBySlug(root, slug);
    if (!loaded) continue;
    const findings = runDeterministicChecks(loaded.post, readJsonIfExists(ledgerPath(root, slug)), ctx);
    const blockers = findings.filter((f) => f.severity === 'blocker');
    const byRule = {};
    for (const f of blockers) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
    rows.push({ slug, blockers: blockers.length, majors: findings.filter((f) => f.severity === 'major').length, byRule });
  }
  console.log(JSON.stringify({ audited: rows.length, rows }, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--audit')) return audit();
  const slug = args.find((a) => a.startsWith('--slug='))?.slice(7);
  if (!slug) {
    console.error('Usage: --slug=<slug> [--offline] [--model] [--write] | --audit');
    process.exitCode = 1;
    return;
  }
  const loaded = await loadPostBySlug(root, slug);
  if (!loaded) {
    console.error(`No post with slug ${slug}`);
    process.exitCode = 1;
    return;
  }
  const offline = args.includes('--offline');
  const models = args.includes('--model') ? createModels(root) : null;
  if (models && !models.configured) {
    console.error('Model review requested but BLOG_LLM_MODEL / token / account id are not set. Failing closed.');
  }
  const report = await reviewPost({
    post: loaded.post,
    ledger: readJsonIfExists(ledgerPath(root, slug)),
    round: 1,
    ctx: buildCheckContext(root, { today: todayVn(), allowExistingSlug: true }),
    fetchSource: offline ? undefined : cachedSourceFetcher(httpFetchText),
    llmReview: models?.configured ? models.review : undefined,
    model: models?.name ?? null,
    requireModel: Boolean(models),
  });
  if (args.includes('--write')) writeJson(reportPath(root, slug), report);
  console.log(JSON.stringify({ slug, verdict: report.verdict, overallScore: report.overallScore, categories: report.categories, findings: report.findings }, null, 2));
  if (report.verdict !== 'pass') process.exitCode = 3;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
