#!/usr/bin/env node
/**
 * Open one scaffold PR per approved blog slot.
 *
 * Each slug is isolated: a failure is recorded and the loop continues.
 * The process exits 1 at the end when any slug failed.
 *
 * Push is never forced. A shallow checkout used to make
 * `git push --force-with-lease` compare `blog/<slug>` with `origin/main`
 * and reject the update as stale info, which aborted every later slug.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { countBlogWordsIsCorrupted } from './blog-register-scaffold.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @param {{ event?: string, dispatchDate?: string, dispatchSlug?: string, inputDate?: string, inputSlug?: string, polledRows?: { date?: string, slug?: string }[] }} input
 * @returns {{ date: string, slug: string }[]}
 */
export function collectJobs(input) {
  const jobs = [];
  const event = input.event || '';
  if (event === 'repository_dispatch' && input.dispatchDate && input.dispatchSlug) {
    jobs.push({ date: input.dispatchDate, slug: input.dispatchSlug });
  } else if (input.inputDate && input.inputSlug) {
    jobs.push({ date: input.inputDate, slug: input.inputSlug });
  }
  if (event === 'schedule' || jobs.length === 0) {
    for (const row of input.polledRows || []) {
      if (row?.date && row?.slug) jobs.push({ date: String(row.date), slug: String(row.slug) });
    }
  }
  const seen = new Set();
  const unique = [];
  for (const job of jobs) {
    const key = `${job.date}:${job.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(job);
  }
  return unique;
}

/** @param {{ date?: string, slug?: string }} job */
export function assertJobShape(job) {
  if (!job || !DATE_RE.test(job.date || '') || !SLUG_RE.test(job.slug || '')) {
    throw new Error(`invalid schedule job: ${job?.date ?? ''} ${job?.slug ?? ''}`);
  }
}

/** @param {string} branch */
export function remoteBranchFetchRefspec(branch) {
  return `refs/heads/${branch}:refs/remotes/origin/${branch}`;
}

/**
 * @param {{ branch: string, remoteExists: boolean, isAncestor: boolean }} input
 * @returns {{ action: 'create' | 'fast-forward' | 'refuse', args: string[], reason?: string }}
 */
export function decidePush(input) {
  const refspec = `HEAD:refs/heads/${input.branch}`;
  const args = ['push', '-u', 'origin', refspec];
  if (!input.remoteExists) return { action: 'create', args };
  if (input.isAncestor) return { action: 'fast-forward', args };
  return {
    action: 'refuse',
    args: [],
    reason: `branch ${input.branch} is not a fast-forward of the commit to publish; refusing to force-push`,
  };
}

/** @param {string[]} args */
export function assertNoForce(args) {
  for (const arg of args) {
    if (arg === '--force' || arg === '--force-with-lease' || arg.startsWith('--force')) {
      throw new Error(`force push is not allowed: ${arg}`);
    }
  }
}

/**
 * @param {{ date: string, slug: string, error: string }[]} failures
 */
export function formatFailureReport(failures) {
  if (!failures.length) return '';
  const lines = ['Failed slugs:'];
  for (const failure of failures) {
    lines.push(`- ${failure.date} ${failure.slug}: ${failure.error}`);
  }
  return lines.join('\n');
}

/**
 * @param {{ date: string, slug: string }[]} jobs
 * @param {{ handle: (job: { date: string, slug: string }) => Promise<unknown>, reset?: () => Promise<void> }} ctx
 */
export async function runApproveJobs(jobs, ctx) {
  /** @type {unknown[]} */
  const ok = [];
  /** @type {{ date: string, slug: string, error: string }[]} */
  const failures = [];
  for (const job of jobs) {
    try {
      ok.push(await ctx.handle(job));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const failure = { date: job.date, slug: job.slug, error: message };
      if (ctx.reset) {
        try {
          await ctx.reset();
        } catch (resetError) {
          const resetMessage = resetError instanceof Error ? resetError.message : String(resetError);
          failure.error = `${message} (reset failed: ${resetMessage})`;
        }
      }
      failures.push(failure);
    }
  }
  return { ok, failures, exitCode: failures.length ? 1 : 0 };
}

/**
 * Fetch the existing blog branch when it exists, build the scaffold on a
 * fast-forward, and push without --force. A broken stub (countBlogWords
 * edited) is refused instead of reused.
 *
 * @param {{ date: string, slug: string }} job
 * @param {Record<string, Function>} ctx
 */
export async function openScaffoldForJob(job, ctx) {
  assertJobShape(job);
  const branch = `blog/${job.slug}`;
  if (await ctx.isPublished(job)) {
    return { status: 'skipped-published', branch, date: job.date, slug: job.slug };
  }

  await ctx.git(['fetch', '--no-tags', 'origin', 'main']);
  let remoteExists = true;
  try {
    await ctx.git(['fetch', '--no-tags', 'origin', remoteBranchFetchRefspec(branch)]);
  } catch {
    remoteExists = false;
  }

  if (!remoteExists) {
    await ctx.git(['checkout', '--detach', 'origin/main']);
  } else {
    await ctx.git(['checkout', '--force', '-B', branch, `origin/${branch}`]);
    const blogTs = await ctx.readBlogTs();
    if (countBlogWordsIsCorrupted(blogTs)) {
      throw new Error(
        `branch ${branch} is a broken scaffold (countBlogWords was edited); refusing to force-push or reuse it`,
      );
    }
    try {
      await ctx.git(['merge', '--ff-only', 'origin/main']);
    } catch {
      try {
        await ctx.git(['merge', '--abort']);
      } catch {
        /* no merge in progress */
      }
    }
  }

  await ctx.scaffold(job);
  await ctx.register();
  const prompt = await ctx.prompt(job);
  await ctx.git(['add', '--', 'src/data/blogPosts', 'src/data/blog.ts']);
  if (await ctx.hasStagedChanges()) {
    await ctx.git(['commit', '-m', `chore(blog): scaffold ${job.slug} after email APPROVE`]);
  }

  let isAncestor = false;
  if (remoteExists) {
    isAncestor = await ctx.isAncestor(`origin/${branch}`, 'HEAD');
  }
  const plan = decidePush({ branch, remoteExists, isAncestor });
  if (plan.action === 'refuse') {
    throw new Error(plan.reason || `refusing to update ${branch}`);
  }
  assertNoForce(plan.args);
  await ctx.git(plan.args);

  const title = `Blog: ${job.slug} (${job.date})`;
  const body = [
    prompt,
    '',
    '---',
    '',
    'Approved via editorial email (`sycu.lee@gmail.com`).',
    '',
    'After expanding bilingual content (≥400 words/lang), **merge this PR** then deploy to publish.',
    '',
  ].join('\n');
  await ctx.writePrBody(body);
  let prExists = true;
  try {
    await ctx.gh(['pr', 'view', branch, '--json', 'number']);
  } catch {
    prExists = false;
  }
  if (prExists) {
    await ctx.gh(['pr', 'edit', branch, '--title', title, '--body-file', ctx.prBodyPath]);
  } else {
    await ctx.gh([
      'pr',
      'create',
      '--base',
      'main',
      '--head',
      branch,
      '--title',
      title,
      '--body-file',
      ctx.prBodyPath,
    ]);
  }
  const prLine = String(await ctx.prLine(branch)).trim();
  const prUrl = prLine.split(/\s+/).pop() || '';
  if (ctx.notify) await ctx.notify(job, prUrl, prLine);
  return { status: 'opened', branch, date: job.date, slug: job.slug, prUrl, action: plan.action };
}

function git(args) {
  assertNoForce(args);
  execFileSync('git', args, { cwd: root, stdio: 'inherit' });
}

function gitOk(args) {
  try {
    execFileSync('git', args, { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function gitOut(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function publishedOnDisk(slug) {
  const { readdirSync, readFileSync: read } = requireFs();
  const dir = path.join(root, 'src/data/blogPosts');
  for (const fileName of readdirSync(dir)) {
    if (!fileName.endsWith('.ts')) continue;
    const text = read(path.join(dir, fileName), 'utf8');
    if (text.includes(`slug: '${slug}'`)) return true;
  }
  return false;
}

function requireFs() {
  return { readdirSync, readFileSync };
}

function realContext() {
  const prBodyPath = '/tmp/pr-body.md';
  return {
    prBodyPath,
    isPublished(job) {
      return publishedOnDisk(job.slug);
    },
    git(args) {
      git(args);
    },
    readBlogTs() {
      return readFileSync(path.join(root, 'src/data/blog.ts'), 'utf8');
    },
    scaffold(job) {
      const result = spawnSync('node', ['scripts/blog-editorial.mjs', '--scaffold', `--date=${job.date}`], {
        cwd: root,
        encoding: 'utf8',
      });
      const output = `${result.stdout || ''}\n${result.stderr || ''}`;
      if (output.trim()) process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
      if (result.status === 0) return;
      if (/Already published|File already exists|already exists/i.test(output)) {
        console.log('scaffold skipped (exists?)');
        return;
      }
      throw new Error(output.trim() || `scaffold failed for ${job.slug}`);
    },
    register() {
      execFileSync('node', ['scripts/blog-register-scaffold.mjs'], { cwd: root, stdio: 'inherit' });
    },
    prompt(job) {
      return execFileSync('node', ['scripts/blog-editorial.mjs', '--prompt', `--date=${job.date}`], {
        cwd: root,
        encoding: 'utf8',
      });
    },
    hasStagedChanges() {
      return !gitOk(['diff', '--cached', '--quiet']);
    },
    isAncestor(ancestor, descendant) {
      return gitOk(['merge-base', '--is-ancestor', ancestor, descendant]);
    },
    writePrBody(body) {
      writeFileSync(prBodyPath, body);
    },
    gh(args) {
      execFileSync('gh', args, { cwd: root, stdio: 'inherit' });
    },
    prLine(branch) {
      return execFileSync(
        'gh',
        ['pr', 'view', branch, '--json', 'url,number', '--jq', '"PR #" + (.number|tostring) + " " + .url'],
        { cwd: root, encoding: 'utf8' },
      );
    },
    async notify(job, prUrl, prLine) {
      await markPr(job.date, job.slug, prUrl);
      await emailPr(job.date, job.slug, prLine);
    },
    async reset() {
      git(['checkout', '--force', 'main']);
      git(['reset', '--hard', 'origin/main']);
      git(['clean', '-fd', '--', 'src/data/blogPosts', 'src/data/blog.ts']);
    },
  };
}

async function pollApprovedRows() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID_FALLBACK;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const dbId = process.env.D1_DATABASE_ID;
  if (!accountId || !token || !dbId) {
    console.error('Missing CLOUDFLARE_API_TOKEN for D1 poll (production env secrets)');
    return [];
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `SELECT date, slug FROM blog_editorial WHERE status = 'approved' AND (pr_url IS NULL OR pr_url = '') ORDER BY updated_at ASC LIMIT 20`,
      }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    console.error('D1 query failed', res.status, JSON.stringify(data));
    return [];
  }
  return data.result?.[0]?.results || data.result?.results || [];
}

async function markPr(date, slug, prUrl) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID_FALLBACK;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const dbId = process.env.D1_DATABASE_ID;
  if (!accountId || !token || !dbId || !prUrl) return;
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: `UPDATE blog_editorial SET status = 'pr_opened', pr_url = ?, note = 'opened_by_actions', updated_at = datetime('now') WHERE date = ? AND slug = ?`,
      params: [prUrl, date, slug],
    }),
  });
}

async function emailPr(date, slug, prLine) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID_FALLBACK;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) return;
  const fromRaw = process.env.WORKSHOP_EMAIL_FROM || 'Cloudflare Starter Hub <onboarding@orangecloud.vn>';
  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'sycu.lee@gmail.com',
      from: fromPayload(fromRaw),
      subject: `[Blog] PR sẵn sàng — ${date} ${slug}`,
      text: `APPROVE đã nhận.\n${prLine}\n\nViết đủ nội dung bilingual rồi merge PR (+ deploy) để đăng.`,
      html: `<p>APPROVE đã nhận.</p><p><strong>${escapeHtml(prLine)}</strong></p><p>Viết đủ nội dung bilingual rồi <strong>merge PR</strong> (+ deploy) để đăng.</p>`,
    }),
  });
}

function fromPayload(raw) {
  const match = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), address: match[2].trim() };
  return raw.trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function main() {
  execFileSync('git', ['config', 'user.name', 'blog-editorial-bot'], { cwd: root, stdio: 'inherit' });
  execFileSync('git', ['config', 'user.email', 'onboarding@orangecloud.vn'], { cwd: root, stdio: 'inherit' });

  const event = process.env.EVENT_NAME || '';
  let polledRows = [];
  const hasDispatch = event === 'repository_dispatch' && process.env.DISPATCH_DATE && process.env.DISPATCH_SLUG;
  const hasInputs = process.env.INPUT_DATE && process.env.INPUT_SLUG;
  if (event === 'schedule' || (!hasDispatch && !hasInputs)) {
    polledRows = await pollApprovedRows();
  }
  const jobs = collectJobs({
    event,
    dispatchDate: process.env.DISPATCH_DATE || '',
    dispatchSlug: process.env.DISPATCH_SLUG || '',
    inputDate: process.env.INPUT_DATE || '',
    inputSlug: process.env.INPUT_SLUG || '',
    polledRows,
  });
  console.log(JSON.stringify({ jobs }, null, 2));
  if (jobs.length === 0) {
    console.log('No approved blog jobs — done');
    return;
  }

  const ctx = realContext();
  const result = await runApproveJobs(jobs, {
    handle: (job) => openScaffoldForJob(job, ctx),
    reset: () => ctx.reset(),
  });
  for (const item of result.ok) {
    console.log(JSON.stringify(item));
  }
  if (result.failures.length) {
    console.error(formatFailureReport(result.failures));
    process.exitCode = result.exitCode;
  }
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
