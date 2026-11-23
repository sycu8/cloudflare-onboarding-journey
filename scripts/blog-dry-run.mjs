/**
 * Run the blog pipeline for one schedule slug and print rubric scores.
 * Does not write files, open a PR, or publish.
 *
 *   BLOG_LLM_MODEL=@cf/openai/gpt-oss-120b \
 *   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… \
 *   node --experimental-strip-types scripts/blog-dry-run.mjs --slug=snippets-javascript-tren-edge
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { llmConfig } from './lib/llm.mjs';
import { createModels } from './lib/blog-review/models.mjs';
import { runPipeline } from './lib/blog-review/pipeline.mjs';
import { buildCheckContext } from './lib/blog-review/repo.mjs';
import { cachedSourceFetcher, httpFetchText } from './lib/blog-review/sources.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slugArg = process.argv.find((arg) => arg.startsWith('--slug='));
const slug = slugArg ? slugArg.slice('--slug='.length) : 'snippets-javascript-tren-edge';
const schedule = JSON.parse(readFileSync(path.join(root, 'src/data/blogSchedule.data.json'), 'utf8'));
const item = schedule.find((entry) => entry.slug === slug);
if (!item) {
  console.error(`dry-run: unknown slug ${slug}`);
  process.exit(1);
}
const cfg = llmConfig(process.env);
if (!cfg.configured) {
  console.log('dry-run skipped: BLOG_LLM_MODEL, an AI token, and an account id are not all set');
  process.exit(0);
}

const result = await runPipeline({
  item,
  models: createModels(root, process.env),
  fetchSource: cachedSourceFetcher(httpFetchText),
  ctx: buildCheckContext(root, { today: item.date, allowExistingSlug: true }),
  requireModelReview: true,
  log: (line) => console.log(line),
});

const last = result.reports.at(-1);
console.log(`dry-run state=${result.state} rounds=${result.reports.length} reason=${result.reason}`);
if (last) {
  console.log(`dry-run overall=${last.overallScore} verdict=${last.verdict}`);
  for (const [name, category] of Object.entries(last.categories)) {
    console.log(`dry-run score ${name}=${category.score} threshold=${category.threshold} pass=${category.pass}`);
  }
  const blockers = (last.findings || []).filter((finding) => finding.severity === 'blocker' || !last.categories[finding.category]?.pass);
  for (const finding of blockers) {
    console.log(`dry-run blocker ${finding.rule} ${finding.location || ''} ${finding.message}`);
  }
}
if (result.state !== 'approved') process.exitCode = 2;
