#!/usr/bin/env node
/**
 * Fetch and review an external contribution (PR or branch) against origin/main.
 *
 * Usage:
 *   node scripts/review-contribution.mjs <pr-number>
 *   node scripts/review-contribution.mjs --branch feat/foo
 *   node scripts/review-contribution.mjs 12 --verify
 *
 * Requires: git, gh (GitHub CLI) for PR mode.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const verify = args.includes('--verify');
const filtered = args.filter((a) => a !== '--verify');
const branchFlag = filtered.indexOf('--branch');
const branchName = branchFlag >= 0 ? filtered[branchFlag + 1] : null;
const prArg = filtered.find((a) => /^\d+$/.test(a));

const FORBIDDEN = [
  /^\.env$/,
  /^\.dev\.vars$/,
  /^wrangler\.toml$/,
  /^wrangler\.local\.toml$/,
  /node_modules\//,
  /^dist\//,
  /\.pem$/,
  /credentials\.json$/,
];

const ZONES = [
  { id: 'routing-seo', label: 'Routing & SEO', patterns: [/^src\/pages\//, /^src\/lib\/seo\.ts/, /^astro\.config/] },
  { id: 'chrome-i18n', label: 'Chrome & i18n', patterns: [/^src\/components\/chrome\//, /^src\/components\/ui\//, /^src\/i18n\//, /^src\/styles\/global\.css/] },
  { id: 'learning-content', label: 'Learning content', patterns: [/^src\/data\/tracks\.ts/, /^src\/data\/trackLessons/, /^src\/data\/trackLessonBestPractices/, /^src\/data\/useCases\.ts/, /^src\/data\/beginnerJourney/] },
  { id: 'catalog-sync', label: 'Catalog / sync data', patterns: [/\.data\.json$/, /^scripts\/sync-/, /^scripts\/scrape-/] },
  { id: 'interactive', label: 'Interactive islands', patterns: [/^src\/components\/interactive\//] },
  { id: 'functions', label: 'Pages Functions', patterns: [/^functions\//] },
  { id: 'bindings-deploy', label: 'Bindings & deploy', patterns: [/^wrangler\.toml\.example/, /^package\.json$/, /^package-lock\.json$/] },
  { id: 'tests', label: 'Tests', patterns: [/^tests\//, /^playwright\.config/, /^scripts\/smoke-test/] },
  { id: 'static-headers', label: 'Static & headers', patterns: [/^public\//] },
];

function run(cmd, opts = {}) {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', ...opts });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim(), status: r.status };
}

function hasGh() {
  return run('gh --version').ok;
}

function gitStatusPorcelain() {
  return run('git status --porcelain').out;
}

function mapFile(path) {
  const hits = ZONES.filter((z) => z.patterns.some((p) => p.test(path))).map((z) => z.label);
  const forbidden = FORBIDDEN.some((p) => p.test(path));
  return { path, zones: hits.length ? hits : ['(other)'], forbidden };
}

function localOverlap(changedFiles) {
  const status = gitStatusPorcelain();
  if (!status) return [];
  const localPaths = new Set();
  for (const line of status.split('\n')) {
    const p = line.slice(3).trim();
    if (p) localPaths.add(p.replace(/\\/g, '/'));
  }
  return changedFiles.filter((f) => {
    const norm = f.replace(/\\/g, '/');
    return [...localPaths].some((l) => l === norm || l.endsWith(norm) || norm.endsWith(l));
  });
}

function printSection(title) {
  console.log(`\n=== ${title} ===\n`);
}

let reviewRef;
let prMeta = null;

printSection('Contribution review');
run('git fetch origin');

if (prArg) {
  if (!hasGh()) {
    console.error('GitHub CLI (gh) required for PR mode. Install: https://cli.github.com/');
    process.exit(1);
  }
  const n = prArg;
  reviewRef = `pr-review-${n}`;
  const json = run(`gh pr view ${n} --json title,body,headRefName,baseRefName,state,files,additions,deletions,url`);
  if (!json.ok) {
    console.error(json.err || json.out);
    process.exit(1);
  }
  prMeta = JSON.parse(json.out);
  const fetchPr = run(`git fetch origin pull/${n}/head:${reviewRef}`);
  if (!fetchPr.ok) {
    console.error(fetchPr.err || fetchPr.out);
    process.exit(1);
  }
  console.log(`PR #${n}: ${prMeta.title}`);
  console.log(prMeta.url);
  console.log(`Branch: ${prMeta.headRefName} → ${prMeta.baseRefName} (${prMeta.state})`);
  console.log(`+${prMeta.additions} / -${prMeta.deletions} lines (GitHub file list)`);
} else if (branchName) {
  reviewRef = branchName;
  run(`git fetch origin ${branchName}:${branchName}`).ok || run(`git fetch origin ${branchName}`);
  console.log(`Branch: ${branchName}`);
} else {
  console.error('Usage: node scripts/review-contribution.mjs <pr-number> [--verify]');
  console.error('       node scripts/review-contribution.mjs --branch feat/x [--verify]');
  process.exit(1);
}

const base = 'origin/main';
const stat = run(`git diff ${base}...${reviewRef} --stat`);
const nameOnly = run(`git diff ${base}...${reviewRef} --name-only`);
if (!nameOnly.ok) {
  console.error(nameOnly.err || nameOnly.out);
  process.exit(1);
}

const files = nameOnly.out.split('\n').filter(Boolean);
printSection('Diff vs main');
console.log(stat.out || '(no diff)');
printSection('Zone mapping (see docs/CONTRIBUTION_MAP.md)');
const forbiddenFiles = [];
const zoneSet = new Set();
for (const f of files) {
  const m = mapFile(f);
  if (m.forbidden) forbiddenFiles.push(f);
  m.zones.forEach((z) => zoneSet.add(z));
  console.log(`${m.forbidden ? '⛔' : '•'} ${f}`);
  console.log(`    → ${m.zones.join(', ')}`);
}

if (forbiddenFiles.length) {
  printSection('BLOCKED — forbidden paths');
  forbiddenFiles.forEach((f) => console.log(`  ${f}`));
}

const overlap = localOverlap(files);
if (overlap.length) {
  printSection('Warning — overlaps your uncommitted local files');
  overlap.forEach((f) => console.log(`  ${f}`));
  console.log('\nStash or commit local WIP before merge. See docs/MAINTAINER_REVIEW.md');
}

printSection('Risk summary');
console.log(`Files changed: ${files.length}`);
console.log(`Zones touched: ${[...zoneSet].join('; ') || 'none'}`);

if (verify && !forbiddenFiles.length) {
  const worktreeDir = join(process.cwd(), '.worktrees', reviewRef.replace(/\//g, '-'));
  printSection('Verify (worktree build + smoke)');
  mkdirSync(join(process.cwd(), '.worktrees'), { recursive: true });
  if (existsSync(worktreeDir)) {
    run(`git worktree remove --force "${worktreeDir}"`);
  }
  const add = run(`git worktree add "${worktreeDir}" ${reviewRef}`);
  if (!add.ok) {
    console.error(add.err || add.out);
    process.exit(1);
  }
  try {
    let step = run('npm ci', { cwd: worktreeDir });
    if (!step.ok) throw new Error(step.err || step.out);
    step = run('npm run build', { cwd: worktreeDir });
    if (!step.ok) throw new Error(step.err || step.out);
    console.log('✓ build passed in worktree (.worktrees/)');
    console.log('  Smoke/e2e: rely on PR CI or run preview + npm run test:smoke on main after merge.');
  } catch (e) {
    console.error('✗ verify failed:', e.message || e);
    process.exit(1);
  } finally {
    run(`git worktree remove --force "${worktreeDir}"`);
  }
}

printSection('Next (maintainer)');
console.log('1. Read full diff: git diff origin/main...' + reviewRef);
console.log('2. Agent/maintainer decision: Approve | Request changes | Block');
console.log('3. Merge on GitHub when ready — you pull main, then npm run deploy');
if (!verify) console.log('\nTip: add --verify for isolated build in .worktrees/');
