/**
 * gpt-oss client: Responses API request shape and recorded reply fixtures.
 * Offline. Does not call api.cloudflare.com and does not print tokens.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatJson, extractAssistantText, extractJson, isGptOssModel } from './lib/llm.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDir = path.join(root, 'scripts/fixtures/gpt-oss');
const fixture = (name) => JSON.parse(readFileSync(path.join(fixtureDir, name), 'utf8'));

const env = {
  BLOG_LLM_MODEL: '@cf/openai/gpt-oss-120b',
  BLOG_AI_API_TOKEN: 'test-token-not-a-secret',
  CLOUDFLARE_ACCOUNT_ID: 'acc',
};
const prompt = { system: 'Reply with JSON only.', user: 'Return {"ok":true}.' };

function fakeFetch(script) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, headers: init.headers, body });
    assert.equal(JSON.stringify(body).includes(env.BLOG_AI_API_TOKEN), false, 'request body must not contain the token');
    assert.equal(JSON.stringify(init.headers).includes('CLOUDFLARE_API_TOKEN'), false);
    const next = script[calls.length - 1];
    if (!next) throw new Error(`unexpected fetch #${calls.length}`);
    return {
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      json: async () => next.json,
    };
  };
  return { calls, fetchImpl };
}

assert.equal(isGptOssModel('@cf/openai/gpt-oss-120b'), true);
assert.equal(isGptOssModel('@cf/openai/gpt-oss-20b'), true);
assert.equal(isGptOssModel('@cf/meta/llama-3.1-8b-instruct-fp8'), false);
assert.equal(isGptOssModel('openai/gpt-5.5'), false);

{
  const body = fixture('responses-output-text.json');
  const extracted = extractAssistantText(body);
  assert.equal(extracted.reasoningOnly, false);
  assert.match(extracted.text, /output_text/);
  const { calls, fetchImpl } = fakeFetch([{ status: 200, json: body }]);
  const out = await chatJson(prompt, { env, fetchImpl });
  assert.deepEqual(out, { ok: true, via: 'output_text' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.cloudflare.com/client/v4/accounts/acc/ai/v1/responses');
  assert.equal(calls[0].headers['cf-aig-gateway-id'], 'default');
  assert.equal(calls[0].headers.Authorization, `Bearer ${env.BLOG_AI_API_TOKEN}`);
  assert.equal(calls[0].body.model, '@cf/openai/gpt-oss-120b');
  assert.equal(calls[0].body.stream, false);
  assert.equal(calls[0].body.reasoning.effort, 'low');
  assert.equal(calls[0].body.max_output_tokens, 8192);
  assert.deepEqual(calls[0].body.input.map((m) => m.role), ['system', 'user']);
}

{
  const body = fixture('responses-output-parts.json');
  assert.equal(extractAssistantText(body).text, '{"ok":true,"via":"parts"}');
  const { calls, fetchImpl } = fakeFetch([{ status: 200, json: body }]);
  const out = await chatJson(prompt, { env, fetchImpl });
  assert.deepEqual(out, { ok: true, via: 'parts' });
  assert.equal(calls.length, 1, 'a non-empty output part is enough; no retry');
}

{
  const body = fixture('responses-live-2026-11-23.json');
  const extracted = extractAssistantText(body);
  assert.equal(extracted.reasoningOnly, false);
  assert.equal(extracted.text, '{"ok":true,"model":"gpt-oss-120b"}');
  assert.match(extracted.reasoningText, /exactly that JSON/);
  const out = await chatJson(prompt, { env, fetchImpl: fakeFetch([{ status: 200, json: body }]).fetchImpl });
  assert.deepEqual(out, { ok: true, model: 'gpt-oss-120b' });
}

{
  const body = fixture('responses-result-wrapped.json');
  assert.equal(extractAssistantText(body).text, '{"ok":true,"via":"result"}');
  const out = await chatJson(prompt, { env, fetchImpl: fakeFetch([{ status: 200, json: body }]).fetchImpl });
  assert.deepEqual(out, { ok: true, via: 'result' });
}

{
  const empty = fixture('chat-empty-content.json');
  empty.choices[0].message.reasoning = '';
  const reasoningOnly = fixture('responses-reasoning-only.json');
  const recovered = fixture('responses-output-text.json');
  const { calls, fetchImpl } = fakeFetch([
    { status: 200, json: empty },
    { status: 200, json: recovered },
  ]);
  const out = await chatJson(prompt, { env, fetchImpl });
  assert.deepEqual(out, { ok: true, via: 'output_text' });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].body.max_output_tokens, 16384);
  assert.equal(calls[1].body.reasoning.effort, 'low');
  assert.equal(extractAssistantText(reasoningOnly).reasoningOnly, true);
}

{
  const reasoningOnly = fixture('responses-reasoning-only.json');
  const chatReasoning = fixture('chat-empty-content.json');
  const { calls, fetchImpl } = fakeFetch([
    { status: 200, json: reasoningOnly },
    { status: 200, json: chatReasoning },
  ]);
  await assert.rejects(chatJson(prompt, { env, fetchImpl }), /AI reply was reasoning only/);
  assert.equal(calls.length, 2, 'reasoning text is never parsed as the answer');
  assert.equal(calls[1].body.input[1].content.includes('strict JSON'), true);
}

{
  const bad = {
    output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'title{vi,en} is a field note' }] }],
    output_text: '',
  };
  const good = fixture('responses-output-text.json');
  const { calls, fetchImpl } = fakeFetch([
    { status: 200, json: bad },
    { status: 200, json: good },
  ]);
  const out = await chatJson(prompt, { env, fetchImpl });
  assert.deepEqual(out, { ok: true, via: 'output_text' });
  assert.equal(calls.length, 2);
  assert.match(calls[1].body.input[1].content, /strict JSON/);
  assert.equal(calls[1].body.input[1].content.includes('Still planning'), false);
}

{
  const empty = fixture('chat-empty-content.json');
  empty.choices[0].message.content = '';
  empty.choices[0].message.reasoning = '';
  const { calls, fetchImpl } = fakeFetch([
    { status: 200, json: empty },
    { status: 200, json: empty },
  ]);
  await assert.rejects(chatJson(prompt, { env, fetchImpl }), /AI reply was empty/);
  assert.equal(calls.length, 2);
}

{
  const logs = [];
  const original = console.log;
  console.log = (...args) => logs.push(args.map(String).join(' '));
  try {
    const { fetchImpl } = fakeFetch([
      { status: 503, json: { errors: [{ code: 7001 }] } },
      { status: 200, json: fixture('responses-output-text.json') },
    ]);
    const out = await chatJson(prompt, { env, fetchImpl });
    assert.deepEqual(out, { ok: true, via: 'output_text' });
  } finally {
    console.log = original;
  }
  assert.equal(logs.some((line) => line.includes(env.BLOG_AI_API_TOKEN)), false);
}

{
  const { calls, fetchImpl } = fakeFetch([{ status: 401, json: { errors: [{ code: 10000 }] } }]);
  await assert.rejects(chatJson(prompt, { env, fetchImpl }), /HTTP 401 codes 10000/);
  assert.equal(calls.length, 1, 'auth failures are not retried');
}

{
  let seen;
  const fetchImpl = async (url, init) => {
    seen = { url, body: JSON.parse(init.body) };
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: '{"ok":true}' } }] }) };
  };
  const out = await chatJson(prompt, {
    env: { BLOG_LLM_MODEL: 'openai/gpt-5.5', BLOG_AI_API_TOKEN: 'tok', CLOUDFLARE_ACCOUNT_ID: 'acc' },
    fetchImpl,
    temperature: 0,
  });
  assert.deepEqual(out, { ok: true });
  assert.equal(seen.url, 'https://api.cloudflare.com/client/v4/accounts/acc/ai/v1/chat/completions');
  assert.equal(seen.body.temperature, 0);
  assert.equal(seen.body.max_output_tokens, undefined);
  assert.deepEqual(seen.body.messages.map((m) => m.role), ['system', 'user']);
}

const column2 = /position 1 \(line 1 column 2\)/;
for (const sample of ['{vi,en}', '{post:1}', "{'post':1}"]) {
  assert.throws(() => JSON.parse(sample), column2);
}
assert.throws(() => extractJson('title{vi,en} only'), column2);
const column2Reply = readFileSync(path.join(fixtureDir, 'reply-column-2.txt'), 'utf8');
assert.throws(() => JSON.parse(column2Reply.slice(column2Reply.indexOf('{'), column2Reply.lastIndexOf('}') + 1)), column2);
assert.deepEqual(extractJson(column2Reply), { post: { slug: 'snippets-javascript-tren-edge' }, claims: [] });
assert.deepEqual(extractJson("{ 'post': { 'slug': 's' }, 'claims': [] }"), { post: { slug: 's' }, claims: [] });
assert.deepEqual(extractJson('{ post: { slug: "s" }, claims: [], }'), { post: { slug: 's' }, claims: [] });
assert.deepEqual(
  extractJson('Here is the draft:\n```json\n{ "post": { "slug": "s" }, "claims": [] }\n```\nDone.'),
  { post: { slug: 's' }, claims: [] },
);
assert.deepEqual(extractJson('{ "post": { "slug": "s" }, "claims": [] } // note'), { post: { slug: 's' }, claims: [] });
assert.throws(() => extractJson('no json here'), /no JSON object/);

console.log('test-llm-gpt-oss: all assertions passed');
