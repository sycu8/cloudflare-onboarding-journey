/**
 * Fails when application code still calls a Workers AI model retired on 2026-05-30
 * (those ids now return error 5028) or the llama-3.1-8b-instruct-fast id, whose docs
 * page redirects to ?unavailable=.
 *
 * Catalog JSON under src/data is skipped: it mirrors official Cloudflare tutorial
 * snippets and is not this app's model selection.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const RETIRED_MODEL_IDS = [
  ['@cf/moonshotai/', 'kimi-k2.5'].join(''),
  ['@hf/meta-llama/', 'meta-llama-3-8b-instruct'].join(''),
  ['@cf/meta/', 'llama-3-8b-instruct'].join(''),
  ['@cf/meta/', 'llama-3-8b-instruct-awq'].join(''),
  ['@cf/meta/', 'llama-3.1-8b-instruct'].join(''),
  ['@cf/meta/', 'llama-3.1-8b-instruct-awq'].join(''),
  ['@cf/meta/', 'llama-3.1-8b-instruct-fast'].join(''),
  ['@cf/meta/', 'llama-3.1-70b-instruct'].join(''),
  ['@cf/meta/', 'llama-2-7b-chat-int8'].join(''),
  ['@cf/meta/', 'llama-2-7b-chat-fp16'].join(''),
  ['@cf/mistral/', 'mistral-7b-instruct-v0.1'].join(''),
  ['@hf/mistral/', 'mistral-7b-instruct-v0.2'].join(''),
  ['@hf/google/', 'gemma-7b-it'].join(''),
  ['@cf/google/', 'gemma-3-12b-it'].join(''),
  ['@hf/nousresearch/', 'hermes-2-pro-mistral-7b'].join(''),
  ['@cf/microsoft/', 'phi-2'].join(''),
  ['@cf/defog/', 'sqlcoder-7b-2'].join(''),
  ['@cf/unum/', 'uform-gen2-qwen-500m'].join(''),
  ['@cf/facebook/', 'bart-large-cnn'].join(''),
];

const ACTIVE_MODEL = ['@cf/meta/', 'llama-3.1-8b-instruct-fp8'].join('');
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.astro']);
const SKIP_DIR = new Set(['node_modules', 'dist', '.git', '.wrangler', '.astro', 'coverage']);
const SCAN_ROOTS = ['functions', 'src', 'scripts', 'workers'];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function retiredModelIdsIn(text) {
  const hits = [];
  for (const id of RETIRED_MODEL_IDS) {
    const pattern = new RegExp(`${escapeRegExp(id)}(?![A-Za-z0-9@/_.-])`, 'g');
    if (pattern.test(text)) hits.push(id);
  }
  return hits;
}

function walk(dir, files) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIR.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }
    if (!CODE_EXT.has(extname(entry))) continue;
    files.push(path);
  }
}

function lineOf(text, id) {
  const pattern = new RegExp(`${escapeRegExp(id)}(?![A-Za-z0-9@/_.-])`);
  const match = pattern.exec(text);
  if (!match) return 1;
  return text.slice(0, match.index).split('\n').length;
}

const files = [];
for (const dir of SCAN_ROOTS) walk(join(root, dir), files);

const violations = [];
for (const path of files) {
  const text = readFileSync(path, 'utf8');
  for (const id of retiredModelIdsIn(text)) {
    violations.push(`${relative(root, path)}:${lineOf(text, id)} contains retired model ${id}`);
  }
}

if (violations.length) {
  console.error('Retired Workers AI model ids found in code:');
  for (const line of violations) console.error(`  ${line}`);
  process.exit(1);
}

const bare = ['@cf/meta/', 'llama-3.1-8b-instruct'].join('');
const fast = ['@cf/meta/', 'llama-3.1-8b-instruct-fast'].join('');
assert.deepEqual(retiredModelIdsIn(`call ${ACTIVE_MODEL} please`), []);
assert.deepEqual(retiredModelIdsIn(`call ${bare} please`), [bare]);
assert.deepEqual(retiredModelIdsIn(`call ${fast} please`), [fast]);
assert.ok(!retiredModelIdsIn(ACTIVE_MODEL).includes(bare));

const { aiResponseFailed, onRequestPost } = await import('../functions/api/generate.ts');

assert.equal(aiResponseFailed(null), true);
assert.equal(aiResponseFailed(undefined), true);
assert.equal(aiResponseFailed({ error: '5028' }), true);
assert.equal(aiResponseFailed({ success: false, errors: [{ code: 5028 }] }), true);
assert.equal(aiResponseFailed({ response: null }), true);
assert.equal(aiResponseFailed({ response: '  ' }), true);
assert.equal(aiResponseFailed({ response: 'Five bullets' }), false);

function request(body, raw) {
  return new Request('http://127.0.0.1/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: raw ?? JSON.stringify(body),
  });
}

async function call(body, run, raw) {
  const seen = [];
  const res = await onRequestPost({
    request: request(body, raw),
    env: {
      AI: {
        run: async (model, input) => {
          seen.push({ model, input });
          return run(model, input);
        },
      },
    },
  });
  return { status: res.status, data: await res.json(), seen };
}

const ok = await call({ prompt: 'What is WAF?', lang: 'en' }, async () => ({ response: 'Use a WAF.' }));
assert.equal(ok.status, 200);
assert.equal(ok.data.result.response, 'Use a WAF.');
assert.equal(ok.seen.length, 1);
assert.equal(ok.seen[0].model, ACTIVE_MODEL);
assert.equal(typeof ok.seen[0].input.max_tokens, 'number');
assert.ok(ok.seen[0].input.max_tokens > 0);
assert.equal(retiredModelIdsIn(ok.seen[0].model).length, 0);

for (const lang of ['en', 'vi']) {
  for (const run of [
    async () => null,
    async () => ({ error: 'model retired', code: 5028 }),
    async () => ({ success: false, errors: [{ code: 5028, message: 'retired' }] }),
    async () => ({ response: null }),
    async () => {
      throw new Error('5028');
    },
  ]) {
    const failed = await call({ prompt: 'Workers', lang }, run);
    assert.equal(failed.status, 502);
    assert.equal(typeof failed.data.error, 'string');
    assert.ok(failed.data.error.length > 10);
    assert.equal(failed.data.result, undefined);
    assert.equal(failed.seen.length, 2);
  }
}

const missingBinding = await onRequestPost({
  request: request({ prompt: 'Workers', lang: 'en' }),
  env: {},
});
assert.equal(missingBinding.status, 503);
const missingBody = await missingBinding.json();
assert.match(missingBody.error, /Workers AI/);

const missingPrompt = await call({ prompt: '   ' }, async () => ({ response: 'nope' }));
assert.equal(missingPrompt.status, 400);
assert.equal(missingPrompt.seen.length, 0);

const badJson = await call(null, async () => ({ response: 'nope' }), '{');
assert.equal(badJson.status, 400);

console.log(`retired model scan passed (${files.length} files); /api/generate uses ${ACTIVE_MODEL}`);
