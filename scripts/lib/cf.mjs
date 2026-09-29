/**
 * Thin wrapper around the Cloudflare `cf` CLI (https://github.com/cloudflare/cf).
 *
 * Prefer this over raw `fetch('https://api.cloudflare.com/...')` in maintainer
 * scripts. Auth uses CLOUDFLARE_API_TOKEN (env) or `cf auth login` profiles.
 *
 * Discovery for agents: `npx cf cli search "<task>"` then
 * `npx cf schema <command…>` for the HTTP shape.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

export class CfError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number | null; stderr?: string; code?: number | string }} [extra]
   */
  constructor(message, extra = {}) {
    super(message);
    this.name = 'CfError';
    this.status = extra.status ?? null;
    this.stderr = extra.stderr ?? '';
    this.code = extra.code;
  }
}

/** @returns {string} Absolute path to local `cf` binary, or `cf` on PATH. */
export function resolveCfBin() {
  try {
    const pkgPath = require.resolve('cf/package.json');
    const pkg = require(pkgPath);
    const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.cf;
    if (binRel) {
      const bin = join(dirname(pkgPath), binRel);
      if (existsSync(bin)) return bin;
    }
  } catch {
    /* not installed locally */
  }
  return 'cf';
}

/**
 * Run `cf <args…>` and parse JSON stdout (cf defaults to JSON).
 *
 * @param {string[]} args
 * @param {{ zone?: string; quiet?: boolean; dryRun?: boolean }} [opts]
 * @returns {unknown}
 */
export function cf(args, opts = {}) {
  const { zone, quiet = true, dryRun = false } = opts;
  const bin = resolveCfBin();
  const fullArgs = [...args];

  if (quiet && !fullArgs.includes('-q') && !fullArgs.includes('--quiet')) {
    fullArgs.push('-q');
  }
  if (zone) {
    fullArgs.push('-z', String(zone));
  }
  if (dryRun && !fullArgs.includes('--dry-run')) {
    fullArgs.push('--dry-run');
  }

  const result = spawnSync(bin, fullArgs, {
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.error) {
    throw new CfError(
      `Failed to run ${bin}: ${result.error.message}. Install with: npm install`,
      { status: result.status, stderr: String(result.error) },
    );
  }

  const stdout = (result.stdout || '').trim();
  const stderr = (result.stderr || '').trim();
  const combined = [stderr, stdout].filter(Boolean).join('\n');

  if (result.status !== 0) {
    let code;
    const codeMatch = combined.match(/\[(\d+)\]/);
    if (codeMatch) code = Number(codeMatch[1]);
    const msg =
      stripAnsi(combined).replace(/\n+/g, ' ').trim() ||
      `cf exited with status ${result.status}`;
    throw new CfError(msg, { status: result.status, stderr: combined, code });
  }

  if (!stdout) return null;

  try {
    return JSON.parse(stdout);
  } catch {
    return stdout;
  }
}

/**
 * Run a mutating `cf` command with `--body <json>`.
 *
 * @param {string[]} args Command path without `--body`
 * @param {unknown} body
 * @param {{ zone?: string; quiet?: boolean; dryRun?: boolean }} [opts]
 */
export function cfBody(args, body, opts = {}) {
  return cf([...args, '--body', JSON.stringify(body)], opts);
}

/**
 * @returns {{ authenticated: boolean; authSource?: string; accounts?: unknown[] }}
 */
export function ensureCfAuth() {
  const who = /** @type {{ authenticated?: boolean; authSource?: string; accounts?: unknown[] }} */ (
    cf(['auth', 'whoami'])
  );
  if (!who?.authenticated) {
    throw new CfError(
      'Not authenticated with Cloudflare. Set CLOUDFLARE_API_TOKEN or run: npx cf auth login',
    );
  }
  return who;
}

/** @param {string} text */
function stripAnsi(text) {
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}
