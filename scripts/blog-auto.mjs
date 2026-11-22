#!/usr/bin/env node
/**
 * Default-approved blog pipeline (replaces the email APPROVE gate):
 *   schedule slot → generate → automated review (official sources, rubric)
 *   → fix → re-review (max BLOG_REVIEW_MAX_ROUNDS) → approved files in the
 *   working tree, or held (nothing written to src/, editor notified).
 *
 *   node --experimental-strip-types scripts/blog-auto.mjs [--date=YYYY-MM-DD[,…] | --slug=a[,b]] [--out=/tmp/blog-auto/result.json]
 *   node --experimental-strip-types scripts/blog-auto.mjs --notify=/tmp/blog-auto/result.json
 *   node --experimental-strip-types scripts/blog-auto.mjs --mirror-d1=/tmp/blog-auto/result.json
 *
 * Env: BLOG_AUTO_ENABLED=true (kill switch), BLOG_REQUIRE_EMAIL_APPROVAL,
 * BLOG_REVIEW_MAX_ROUNDS, BLOG_LLM_MODEL (+ token, see scripts/lib/llm.mjs).
 * Never prints secrets. Never pushes, merges or deploys (the workflow does).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { exportNameFromSlug, fileStemFromSlug, resolveEditorialTargets } from './blog-editorial.mjs';
import { applyScaffoldRegistration } from './blog-register-scaffold.mjs';
import { createModels } from './lib/blog-review/models.mjs';
import { runPipeline } from './lib/blog-review/pipeline.mjs';
import { buildCheckContext, ledgerPath, publishedSlugs, renderPostModule, reportPath, writeJson } from './lib/blog-review/repo.mjs';
import { MAX_REVIEW_ROUNDS_DEFAULT } from './lib/blog-review/rubric.mjs';
import { cachedSourceFetcher, httpFetchText } from './lib/blog-review/sources.mjs';
import { canStart } from './lib/blog-review/state.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function todayVn(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** @param {string | undefined} raw */
export function parseMaxRounds(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : MAX_REVIEW_ROUNDS_DEFAULT;
}

/**
 * Write an approved post into the repo working tree and register it.
 * @param {string} repoRoot
 * @param {{ post: any, ledger: any, reports: any[] }} result
 * @returns {string[]} repo-relative paths written
 */
export function writeApproved(repoRoot, result) {
  const { post, ledger } = result;
  const report = result.reports.at(-1);
  const stem = fileStemFromSlug(post.slug);
  const exportName = exportNameFromSlug(post.slug);
  const postRel = `src/data/blogPosts/${stem}.ts`;
  const reportRel = path.relative(repoRoot, reportPath(repoRoot, post.slug));
  writeFileSync(path.join(repoRoot, postRel), renderPostModule(post, { exportName, reportRel }));
  writeJson(ledgerPath(repoRoot, post.slug), ledger);
  writeJson(reportPath(repoRoot, post.slug), report);
  const blogTsPath = path.join(repoRoot, 'src/data/blog.ts');
  const blogTs = readFileSync(blogTsPath, 'utf8');
  writeFileSync(blogTsPath, applyScaffoldRegistration(blogTs, [{ exportName, stem }]));
  return [postRel, path.relative(repoRoot, ledgerPath(repoRoot, post.slug)), reportRel, 'src/data/blog.ts'];
}

/**
 * @param {{ queue: any[], env: NodeJS.ProcessEnv, selectors: { date?: string, slug?: string }, today: string,
 *           published: Set<string>, run: (item: any) => Promise<any> }} input
 */
export async function processTargets(input) {
  const targets =
    resolveEditorialTargets(input.queue, input.selectors) ?? input.queue.filter((row) => row.date === input.today);
  const results = [];
  for (const item of targets) {
    const gate = canStart({
      item,
      autoEnabled: input.env.BLOG_AUTO_ENABLED === 'true',
      alreadyPublished: input.published.has(item.slug),
      requireEmailApproval: input.env.BLOG_REQUIRE_EMAIL_APPROVAL === 'true',
      emailApproved: false,
    });
    if (!gate.ok) {
      results.push({ date: item.date, slug: item.slug, state: gate.state, reason: gate.reason, files: [] });
      continue;
    }
    results.push({ date: item.date, slug: item.slug, ...(await input.run(item)) });
  }
  return results;
}

/** @param {any[]} results */
export function summaryEmail(results, siteOrigin = 'https://onboarding.orangecloud.vn') {
  const lines = results.map((r) => {
    const last = r.lastReport;
    const score = last ? ` · điểm ${last.overallScore}/100 · vòng ${last.round}` : '';
    return `- ${r.date} ${r.slug}: ${r.state.toUpperCase()}${score} — ${r.reason}`;
  });
  const held = results.filter((r) => r.state === 'held');
  const subject = held.length
    ? `[Blog] ${held.length} bài bị giữ lại sau review — cần xem`
    : `[Blog] ${results.filter((r) => r.state === 'approved').length} bài đạt review, đang mở PR đăng`;
  const blockers = held.flatMap((r) =>
    (r.lastReport?.findings || []).filter((f) => f.severity === 'blocker').slice(0, 8).map((f) => `  • [${r.slug}] ${f.rule} ${f.location || ''} ${f.message}`),
  );
  const text = [
    'Kết quả pipeline blog tự động (duyệt mặc định → review nguồn chính thống → sửa → đăng):',
    '',
    ...lines,
    ...(blockers.length ? ['', 'Lỗi chặn (blocker) của bài bị giữ:', ...blockers] : []),
    '',
    'Bài bị giữ KHÔNG được đăng. Báo cáo đầy đủ nằm trong artifact "blog-auto" của workflow run.',
    `Site: ${siteOrigin}/blog/`,
  ].join('\n');
  return { subject, text };
}

async function sendEmail(env, { subject, text }) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || env.CF_ACCOUNT_ID_FALLBACK;
  const token = env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) throw new Error('email: missing Cloudflare credentials');
  const fromRaw = env.WORKSHOP_EMAIL_FROM || 'Cloudflare Starter Hub <onboarding@orangecloud.vn>';
  const m = fromRaw.match(/^(.+?)\s*<([^>]+)>$/);
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: env.BLOG_EDITOR_EMAIL || 'sycu.lee@gmail.com',
      from: m ? { name: m[1].trim(), address: m[2].trim() } : fromRaw,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`email send failed: HTTP ${res.status}`);
}

/** D1 mirror of the state, best effort (git + PR stay the source of truth). */
async function mirrorD1(env, results) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || env.CF_ACCOUNT_ID_FALLBACK;
  const token = env.CLOUDFLARE_API_TOKEN;
  const dbId = env.D1_DATABASE_ID;
  if (!accountId || !token || !dbId) return console.log('D1 mirror skipped (no credentials)');
  for (const r of results) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: `INSERT INTO blog_editorial (date, slug, status, note, created_at, updated_at)
              VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
              ON CONFLICT(date, slug) DO UPDATE SET
                status = CASE WHEN blog_editorial.status = 'published' THEN blog_editorial.status ELSE excluded.status END,
                note = excluded.note, updated_at = datetime('now')`,
        params: [r.date, r.slug, r.state, `auto: ${String(r.reason).slice(0, 180)}`],
      }),
    });
    console.log('D1 mirror', r.slug, r.state, res.ok ? 'ok' : `HTTP ${res.status}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const get = (name) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  if (get('notify')) {
    const results = JSON.parse(readFileSync(get('notify'), 'utf8')).results || [];
    if (!results.length) return console.log('Nothing to notify');
    await sendEmail(process.env, summaryEmail(results));
    return console.log('Editor notified');
  }
  if (get('mirror-d1')) {
    return mirrorD1(process.env, JSON.parse(readFileSync(get('mirror-d1'), 'utf8')).results || []);
  }

  const out = get('out') || '/tmp/blog-auto/result.json';
  const queue = JSON.parse(readFileSync(path.join(root, 'src/data/blogSchedule.data.json'), 'utf8'));
  const today = todayVn();
  const models = createModels(root);
  const fetchSource = cachedSourceFetcher(httpFetchText);
  const maxRounds = parseMaxRounds(process.env.BLOG_REVIEW_MAX_ROUNDS);
  const results = await processTargets({
    queue,
    env: process.env,
    selectors: { date: get('date') || process.env.OVERRIDE_DATE || '', slug: get('slug') || process.env.OVERRIDE_SLUG || '' },
    today,
    published: publishedSlugs(root),
    async run(item) {
      if (!models.configured) {
        return { state: 'held', reason: 'model not configured (BLOG_LLM_MODEL / AI token); failing closed', files: [] };
      }
      const result = await runPipeline({
        item,
        models,
        fetchSource,
        ctx: buildCheckContext(root, { today }),
        maxRounds,
        requireModelReview: true,
        log: (line) => console.log(`[${item.slug}] ${line}`),
      });
      const base = { state: result.state, reason: result.reason, lastReport: result.reports.at(-1) ?? null };
      writeJson(path.join(path.dirname(out), item.slug, 'draft.json'), { post: result.post, ledger: result.ledger });
      result.reports.forEach((r) => writeJson(path.join(path.dirname(out), item.slug, `review-round-${r.round}.json`), r));
      if (result.state !== 'approved') return { ...base, files: [] };
      return { ...base, files: writeApproved(root, result) };
    },
  });
  writeJson(out, { today, maxRounds, model: models.name, results });
  for (const r of results) console.log(`${r.date} ${r.slug}: ${r.state} — ${r.reason}`);
  const gh = process.env.GITHUB_OUTPUT;
  if (gh) {
    const approved = results.filter((r) => r.state === 'approved').map((r) => r.slug);
    writeFileSync(gh, `approved=${approved.join(',')}\nheld=${results.filter((r) => r.state === 'held').length}\nprocessed=${results.length}\n`, { flag: 'a' });
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
