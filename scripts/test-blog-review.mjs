/**
 * Blog auto-review: rubric checks, source quote verification, report schema,
 * state machine and the generate → review → fix → approved | held loop.
 * Offline and deterministic (fake fetch and fake models).
 */
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runDeterministicChecks, postWordCount } from './lib/blog-review/checks.mjs';
import { runPipeline } from './lib/blog-review/pipeline.mjs';
import { buildCheckContext } from './lib/blog-review/repo.mjs';
import { reviewPost, scoreCategories } from './lib/blog-review/review.mjs';
import { CATEGORIES } from './lib/blog-review/rubric.mjs';
import { REVIEW_REPORT_SCHEMA, validate } from './lib/blog-review/schema.mjs';
import { cachedSourceFetcher, candidateFetchUrls, isOfficialUrl, quoteFound } from './lib/blog-review/sources.mjs';
import { afterReview, canStart, normalizeStatus } from './lib/blog-review/state.mjs';
import { chatJson, extractJson, llmConfig } from './lib/llm.mjs';
import { parseMaxRounds, processTargets, summaryEmail, writeApproved } from './blog-auto.mjs';
import { publishedOnDisk } from './blog-on-approve.mjs';
import { countBlogWordsIsCorrupted } from './blog-register-scaffold.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = (v) => JSON.parse(JSON.stringify(v));

// ---------------- fixtures ----------------
const DOC = 'https://developers.cloudflare.com/workers/platform/limits/';
const BLOG = 'https://blog.cloudflare.com/workers-kv-is-ga/';
const QUOTE = 'Workers KV is a global, low-latency, key-value data store.';
const PAGES = {
  [`${DOC}index.md`]: `# Limits\n\n${QUOTE} It supports exceptionally high read volumes.\n\nA Worker on the Free plan can use up to 10 ms of CPU time per request.`,
  [DOC]: '<html><body><p>Rendered page</p></body></html>',
  [BLOG]: '<html><body><article><p>Today we are announcing general availability.</p></article></body></html>',
};
const fakeFetch = cachedSourceFetcher(async (url) => (PAGES[url] ? { status: 200, text: PAGES[url] } : { status: 404, text: '' }));

const viSentence = 'Bài viết này giải thích cách Cloudflare giúp trang web của bạn chạy nhanh hơn và an toàn hơn cho người mới bắt đầu.';
const enSentence = 'This article explains how Cloudflare helps your website run faster and more safely for people who are just starting.';
const para = (n) => ({ vi: Array(n).fill(viSentence).join(' '), en: Array(n).fill(enSentence).join(' ') });

function goodPost() {
  return {
    slug: 'workers-kv-test-post',
    date: '2026-11-25',
    topic: 'workers',
    level: 'entry',
    readingMinutes: 3,
    title: { vi: 'Workers KV cho người mới: lưu dữ liệu gần người dùng', en: 'Workers KV for beginners: store data close to users' },
    description: {
      vi: 'Hướng dẫn ngắn gọn về Workers KV: khi nào nên dùng, giới hạn quan trọng và cách bắt đầu an toàn trên Cloudflare.',
      en: 'A short guide to Workers KV: when to use it, the limits that matter, and how to start safely on Cloudflare.',
    },
    excerpt: { vi: 'Workers KV là kho khóa-giá trị toàn cầu, độ trễ thấp.', en: 'Workers KV is a global, low-latency key-value store.' },
    keywords: { vi: 'Workers KV, Cloudflare, lưu trữ edge', en: 'Workers KV, Cloudflare, edge storage' },
    sections: [
      {
        heading: { vi: 'Workers KV là gì?', en: 'What is Workers KV?' },
        paragraphs: [
          { vi: 'Theo tài liệu chính thức, Workers KV là kho dữ liệu khóa-giá trị toàn cầu với độ trễ thấp.', en: 'According to the official docs, Workers KV is a global, low-latency key-value data store.' },
          para(4),
        ],
      },
      {
        heading: { vi: 'Giới hạn CPU trên gói Free', en: 'CPU limits on the Free plan' },
        paragraphs: [
          { vi: 'Một Worker trên gói Free được dùng tối đa 10 ms CPU cho mỗi request.', en: 'A Worker on the Free plan can use up to 10 ms of CPU time per request.' },
          para(4),
        ],
      },
      { heading: { vi: 'Bắt đầu thế nào?', en: 'How do you start?' }, paragraphs: [para(4), para(3)] },
    ],
    faq: [1, 2, 3].map((i) => ({
      question: { vi: `Câu hỏi thường gặp số ${i} về Workers KV là gì?`, en: `What is frequently asked question number ${i} about Workers KV?` },
      answer: para(1),
    })),
    sources: [
      { title: 'Workers limits', href: DOC },
      { title: 'Workers KV is GA', href: BLOG },
    ],
    relatedTrack: 'developer-platform',
    relatedProductSlugs: ['workers-kv'],
    relatedPostSlugs: ['kv-key-value-edge-khi-nao-dung'],
    hubLinks: [
      { href: '/blog/', label: { vi: 'Blog hub', en: 'Blog hub' } },
      { href: '/cloudflare-101/', label: { vi: 'Cloudflare 101', en: 'Cloudflare 101' } },
    ],
    diagramSlugs: ['fullstack-application'],
  };
}
function goodLedger() {
  return {
    slug: 'workers-kv-test-post',
    claims: [
      { id: 'C1', location: 's0.p0', text: 'Workers KV is a global low-latency key-value store.', sourceUrl: DOC, quote: QUOTE },
      { id: 'C2', location: 's1.p0', text: 'Free plan Workers get 10 ms CPU per request.', sourceUrl: DOC, quote: 'A Worker on the Free plan can use up to 10 ms of CPU time per request.' },
      { id: 'C3', location: 's1.heading', text: 'The Free plan has CPU limits.', sourceUrl: DOC, quote: 'A Worker on the Free plan can use up to 10 ms of CPU time per request.' },
    ],
  };
}

const files = { '/images/blog/kv-flow.svg': '<svg viewBox="0 0 10 10"><title>Workers to Workers KV</title><text font-size="14">Workers → Workers KV</text></svg>', '/images/blog/kv-flow.mmd': 'graph LR' };
const ctx = {
  diagramSlugs: new Set(['fullstack-application']),
  postSlugs: new Set(['kv-key-value-edge-khi-nao-dung']),
  today: '2026-11-22',
  fileSize: (p) => (p in files ? Buffer.byteLength(files[p]) : null),
  readText: (p) => files[p] ?? null,
};
const okModelReview = async ({ ledger }) => ({ claims: ledger.claims.map((c) => ({ id: c.id, verdict: 'supported' })), uncitedClaims: [], findings: [] });
const rules = (findings) => new Set(findings.map((f) => f.rule));

// ---------------- sources ----------------
assert.equal(isOfficialUrl('https://developers.cloudflare.com/kv/'), true);
assert.equal(isOfficialUrl('https://www.cloudflare.com/plans/'), true);
assert.equal(isOfficialUrl('https://www.cloudflare.com/vi-vn/plans/'), true);
assert.equal(isOfficialUrl('https://blog.cloudflare.com/x/'), true);
assert.equal(isOfficialUrl('http://developers.cloudflare.com/kv/'), false, 'https only');
assert.equal(isOfficialUrl('https://community.cloudflare.com/t/1'), false);
assert.equal(isOfficialUrl('https://developers.cloudflare.com.evil.example/'), false);
assert.equal(isOfficialUrl('https://www.cloudflare.com/careers/'), false);
assert.equal(isOfficialUrl('https://medium.com/cloudflare'), false);
assert.deepEqual(candidateFetchUrls('https://developers.cloudflare.com/kv/#x'), ['https://developers.cloudflare.com/kv/index.md', 'https://developers.cloudflare.com/kv/']);
assert.equal(quoteFound('<p>Workers&nbsp;KV is a <b>global</b>, low-latency, key-value data store.</p>', QUOTE), true);
assert.equal(quoteFound('Workers KV is a global key-value data store.', QUOTE), false, 'paraphrase is not a quote');
assert.equal(quoteFound('anything', 'too short'), false);

// ---------------- deterministic checks: the good post is clean ----------------
assert.ok(postWordCount(goodPost(), 'en') >= 400 && postWordCount(goodPost(), 'vi') >= 400, 'fixture length');
const clean = runDeterministicChecks(goodPost(), goodLedger(), ctx);
assert.deepEqual(clean, [], `good post should have no findings: ${JSON.stringify(clean, null, 1)}`);

// ---------------- each rule fails closed ----------------
const mutate = (fn, ledgerFn) => {
  const p = goodPost();
  const l = goodLedger();
  fn(p, l);
  if (ledgerFn) ledgerFn(l);
  return rules(runDeterministicChecks(p, l, ctx));
};
assert.ok(rules(runDeterministicChecks(goodPost(), null, ctx)).has('FACT-001'), 'missing ledger');
assert.ok(mutate((p, l) => { l.claims[0].sourceUrl = 'https://medium.com/kv'; }).has('FACT-002'), 'non-official claim source');
assert.ok(mutate((p) => { p.sources.push({ title: 'SO', href: 'https://stackoverflow.com/q/1' }); }).has('FACT-002'));
assert.ok(mutate((p, l) => { l.claims = l.claims.filter((c) => c.id !== 'C2'); }).has('FACT-004'), 'uncited number');
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].en += ' It costs $5 per month.'; }).has('FACT-004'), 'uncited price');
assert.ok(mutate((p) => { p.sections[0].paragraphs[1].en += ' CloudFlare is great.'; }).has('FACT-005'), 'brand casing');
assert.ok(mutate((p, l) => { l.claims[0].location = 's9.p9'; }).has('FACT-001'), 'claim location must exist');
assert.ok(mutate((p) => { p.faq[0].answer.en = 'TODO'; }).has('STR-006'), 'placeholder');
assert.ok(mutate((p) => { p.sections = p.sections.slice(0, 2); }).has('STR-002'));
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].vi = 'Bai viet nay giai thich cach Cloudflare giup trang web cua ban chay nhanh hon.'; }).has('I18N-003'), 'vi without diacritics');
assert.ok(mutate((p) => { delete p.sections[2].paragraphs[1].en; }).has('I18N-001'));
assert.ok(mutate((p) => { p.title.km = 'ខ្មែរ'; }).has('I18N-002'), 'km all-or-none');
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].en = enSentence; }).has('I18N-005'), 'truncated translation');
assert.ok(mutate((p) => { p.relatedPostSlugs = ['does-not-exist']; }).has('SEO-005'));
assert.ok(mutate((p) => { p.title.en = 'KV'; }).has('SEO-002'));
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].en += ' Run `wrangler publish` to ship.'; }).has('CODE-001'));
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].en += ' Set node_compat = true in wrangler.toml.'; }).has('CODE-001'));
assert.ok(mutate((p) => { p.sections[2].paragraphs[0].en += ' Use compatibility_date = "2027-01-01" today.'; }).has('CODE-002'));
assert.ok(mutate((p) => { p.diagramSlugs = ['made-up-diagram']; }).has('DIA-001'));
const img = (extra) => ({ src: '/images/blog/kv-flow.svg', alt: { vi: 'Sơ đồ Workers đọc dữ liệu từ Workers KV', en: 'Diagram of a Worker reading from Workers KV' }, caption: { vi: 'Worker đọc khóa từ KV.', en: 'A Worker reads a key from KV.' }, provenance: 'original-diagram', labelsLanguageNeutral: true, ...extra });
assert.deepEqual([...mutate((p) => { p.images = [img()]; })], [], 'good original diagram passes');
assert.ok(mutate((p) => { p.images = [img({ src: 'https://example.com/a.png' })]; }).has('IMG-001'), 'no hotlinks');
assert.ok(mutate((p) => { p.images = [img({ src: '/images/blog/missing.webp' })]; }).has('IMG-001'));
assert.ok(mutate((p) => { p.images = [img({ alt: { vi: 'Sơ đồ Workers đọc dữ liệu', en: '' } })]; }).has('IMG-004'), 'alt in each language');
assert.ok(mutate((p) => { p.images = [img({ provenance: undefined })]; }).has('IMG-005'));
assert.ok(mutate((p) => { p.images = [img({ provenance: 'illustration', license: 'CC0', alt: { vi: 'Giao diện dashboard Cloudflare WAF', en: 'Cloudflare dashboard WAF screen' } })]; }).has('IMG-006'), 'no fake dashboard');
assert.ok(mutate((p) => { p.images = [img({ provenance: 'illustration' })]; }).has('IMG-008'), 'license');
files['/images/blog/bad.svg'] = '<svg><text font-size="8" onclick="x()">Worker KV</text></svg>';
const badSvg = mutate((p) => { p.images = [img({ src: '/images/blog/bad.svg', labelsLanguageNeutral: false })]; });
for (const r of ['DIA-002', 'DIA-003', 'DIA-004', 'DIA-005', 'DIA-006', 'DIA-007']) assert.ok(badSvg.has(r), r);

// ---------------- review: network + model, report schema ----------------
const passReport = await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: okModelReview, model: 'fake', requireModel: true, now: new Date('2026-11-22T02:00:00Z') });
assert.equal(passReport.verdict, 'pass', JSON.stringify(passReport.findings));
assert.deepEqual(validate(REVIEW_REPORT_SCHEMA, passReport), []);
assert.ok(passReport.claims.every((c) => c.quoteFound && c.verdict === 'supported'));
assert.equal(passReport.categories.factual.score, 100);

const offline = await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, llmReview: okModelReview, requireModel: true });
assert.equal(offline.verdict, 'fail', 'offline can never pass');
assert.ok(rules(offline.findings).has('FACT-006'));

const noModel = await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, requireModel: true });
assert.equal(noModel.verdict, 'fail', 'missing model fails closed');

const wrongQuote = goodLedger();
wrongQuote.claims[0].quote = 'Workers KV is strongly consistent everywhere at once.';
const wq = await reviewPost({ post: goodPost(), ledger: wrongQuote, round: 1, ctx, fetchSource: fakeFetch, llmReview: okModelReview, requireModel: true });
assert.equal(wq.verdict, 'fail');
assert.ok(rules(wq.findings).has('FACT-008'), 'invented quote is caught by code even if the model says supported');
assert.equal(wq.claims[0].verdict, 'unverifiable', 'model cannot upgrade an unfound quote');

const deadSource = goodPost();
deadSource.sources.push({ title: 'Gone', href: 'https://developers.cloudflare.com/gone/' });
assert.ok(rules((await reviewPost({ post: deadSource, ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: okModelReview, requireModel: true })).findings).has('FACT-007'));

const contradicted = async ({ ledger }) => ({ claims: ledger.claims.map((c) => ({ id: c.id, verdict: c.id === 'C2' ? 'contradicted' : 'supported', note: 'paid plan' })), uncitedClaims: [], findings: [] });
assert.ok(rules((await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: contradicted, requireModel: true })).findings).has('FACT-011'));
const uncited = async (i) => ({ ...(await okModelReview(i)), uncitedClaims: [{ location: 's2.p0', text: 'KV replicates in 1 second' }] });
assert.ok(rules((await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: uncited, requireModel: true })).findings).has('FACT-012'));
const garbage = async () => ({ verdict: 'looks fine' });
assert.ok(rules((await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: garbage, requireModel: true })).findings).has('FACT-009'), 'malformed model output fails closed');
const throws = async () => { throw new Error('HTTP 500'); };
assert.equal((await reviewPost({ post: goodPost(), ledger: goodLedger(), round: 1, ctx, fetchSource: fakeFetch, llmReview: throws, requireModel: true })).verdict, 'fail');

// scoring
const s1 = scoreCategories([{ rule: 'SEO-004', category: 'seo', severity: 'minor', message: 'x' }]);
assert.equal(s1.categories.seo.score, 90);
assert.equal(s1.verdict, 'pass', 'one minor SEO finding still passes');
const s2 = scoreCategories([{ rule: 'STR-003', category: 'structure', severity: 'major', message: 'x' }]);
assert.equal(s2.categories.structure.score, 75);
assert.equal(s2.verdict, 'fail', 'one major structure finding drops below 80');
assert.equal(scoreCategories([{ rule: 'FACT-003', category: 'factual', severity: 'minor', message: 'x' }]).verdict, 'fail', 'factual needs 100');
assert.deepEqual(Object.keys(s1.categories), CATEGORIES);

// ---------------- state machine ----------------
assert.deepEqual(afterReview({ verdict: 'pass', round: 1, maxRounds: 3 }).next, 'approved');
assert.deepEqual(afterReview({ verdict: 'fail', round: 1, maxRounds: 3 }).next, 'fixing');
assert.deepEqual(afterReview({ verdict: 'fail', round: 3, maxRounds: 3 }).next, 'held');
assert.deepEqual(afterReview({ error: 'boom', round: 1, maxRounds: 3 }).next, 'held');
assert.deepEqual(afterReview({ round: 1, maxRounds: 3 }).next, 'held');
assert.equal(normalizeStatus('emailed'), 'scheduled', 'legacy emailed rows re-enter the default-approved flow');
assert.equal(canStart({ item: {}, autoEnabled: true, alreadyPublished: false, requireEmailApproval: false }).ok, true, 'approved by default');
assert.equal(canStart({ item: {}, autoEnabled: false, alreadyPublished: false }).state, 'held_by_editor', 'kill switch');
assert.equal(canStart({ item: { hold: true }, autoEnabled: true, alreadyPublished: false }).ok, false);
assert.equal(canStart({ item: {}, autoEnabled: true, alreadyPublished: false, requireEmailApproval: true, emailApproved: false }).ok, false, 'email override');
assert.equal(canStart({ item: {}, autoEnabled: true, alreadyPublished: true }).state, 'published');
assert.equal(parseMaxRounds('2'), 2);
assert.equal(parseMaxRounds('99'), 3);
assert.equal(parseMaxRounds(undefined), 3);

// ---------------- pipeline ----------------
const item = { date: '2026-11-25', slug: 'workers-kv-test-post', sourceHints: [BLOG], docsHints: [DOC] };
let fixCalls = 0;
const broken = () => { const p = goodPost(); p.sections[1].paragraphs[0].en = 'A Worker on the Free plan can use up to 50 ms of CPU time per request.'; return p; };
const modelsFixOnce = {
  name: 'fake',
  generate: async () => ({ post: broken(), claims: goodLedger().claims.filter((c) => c.id !== 'C2' && c.id !== 'C3') }),
  review: okModelReview,
  fix: async () => { fixCalls += 1; return { post: goodPost(), claims: goodLedger().claims }; },
};
const approved = await runPipeline({ item, models: modelsFixOnce, fetchSource: fakeFetch, ctx, maxRounds: 3 });
assert.equal(approved.state, 'approved', approved.reason);
assert.equal(approved.reports.length, 1, 'uncited Free-plan figure is removed before review');
assert.equal(approved.reports[0].verdict, 'pass');
assert.equal(fixCalls, 0);
assert.equal(/Free plan|50 ms/i.test(approved.post.sections[1].paragraphs[0].en), false);

const stillBroken = () => { const p = goodPost(); p.faq[0].answer.en = 'TODO leftover'; return p; };
const neverFixed = {
  ...modelsFixOnce,
  generate: async () => ({ post: stillBroken(), claims: goodLedger().claims }),
  fix: async () => ({ post: stillBroken(), claims: goodLedger().claims }),
};
const held = await runPipeline({ item, models: neverFixed, fetchSource: fakeFetch, ctx, maxRounds: 2 });
assert.equal(held.state, 'held');
assert.equal(held.reports.length, 2, 'stops after maxRounds');

const moved = await runPipeline({ item, models: { ...modelsFixOnce, generate: async () => ({ post: { ...goodPost(), slug: 'other', date: '2030-01-01' }, claims: goodLedger().claims }) }, fetchSource: fakeFetch, ctx });
assert.equal(moved.post.slug, item.slug, 'schedule owns slug/date');

assert.equal((await runPipeline({ item, models: { ...modelsFixOnce, generate: throws }, fetchSource: fakeFetch, ctx })).state, 'held');
assert.equal((await runPipeline({ item: { ...item, sourceHints: [], docsHints: ['https://developers.cloudflare.com/nope/'] }, models: modelsFixOnce, fetchSource: fakeFetch, ctx })).state, 'held', 'no sources → held');
assert.equal((await runPipeline({ item, models: { ...modelsFixOnce, fix: throws, generate: async () => ({ post: stillBroken(), claims: goodLedger().claims }) }, fetchSource: fakeFetch, ctx })).state, 'held');

// ---------------- orchestrator gate ----------------
const queue = [{ date: '2026-11-22', slug: 'snippets-javascript-tren-edge' }, { date: '2026-11-25', slug: 'next-one' }];
const ran = [];
const r1 = await processTargets({ queue, env: { BLOG_AUTO_ENABLED: 'true' }, selectors: {}, today: '2026-11-22', published: new Set(), run: async (it) => { ran.push(it.slug); return { state: 'approved', reason: 'ok', files: [] }; } });
assert.deepEqual(ran, ['snippets-javascript-tren-edge']);
assert.equal(r1[0].state, 'approved');
const r2 = await processTargets({ queue, env: {}, selectors: {}, today: '2026-11-22', published: new Set(), run: async () => assert.fail('kill switch must stop generation') });
assert.equal(r2[0].state, 'held_by_editor');
const r3 = await processTargets({ queue, env: { BLOG_AUTO_ENABLED: 'true' }, selectors: { slug: 'snippets-javascript-tren-edge,next-one' }, today: '2026-11-01', published: new Set(['next-one']), run: async () => ({ state: 'held', reason: 'x', files: [] }) });
assert.deepEqual(r3.map((r) => r.state), ['held', 'published']);
const mail = summaryEmail([{ date: '2026-11-22', slug: 'a', state: 'held', reason: 'still failing', lastReport: held.reports.at(-1) }]);
assert.match(mail.subject, /bị giữ/);
assert.match(mail.text, /KHÔNG được đăng/);

// ---------------- llm helpers (no network) ----------------
assert.deepEqual(extractJson('```json\n{"a":1}\n```'), { a: 1 });
assert.throws(() => extractJson('no json here'));
assert.equal(llmConfig({}).configured, false);
assert.equal(llmConfig({ BLOG_LLM_MODEL: '@cf/x', CLOUDFLARE_API_TOKEN: 't', CLOUDFLARE_ACCOUNT_ID: 'a' }).configured, true);
assert.equal(llmConfig({ BLOG_LLM_MODEL: '@cf/x' }).gatewayId, 'default', '@cf models need cf-aig-gateway-id');
assert.equal(llmConfig({ BLOG_LLM_MODEL: 'openai/gpt-5.5' }).gatewayId, '');
{
  let seen;
  const fakeAi = async (url, init) => { seen = { url, headers: init.headers, body: JSON.parse(init.body) }; return { ok: true, status: 200, json: async () => ({ output_text: '{"ok":true}' }) }; };
  const out = await chatJson({ system: 's', user: 'u' }, { env: { BLOG_LLM_MODEL: '@cf/openai/gpt-oss-120b', BLOG_AI_API_TOKEN: 'tok', CLOUDFLARE_ACCOUNT_ID: 'acc' }, fetchImpl: fakeAi });
  assert.deepEqual(out, { ok: true });
  assert.equal(seen.url, 'https://api.cloudflare.com/client/v4/accounts/acc/ai/v1/responses');
  assert.equal(seen.headers['cf-aig-gateway-id'], 'default');
  assert.equal(seen.body.model, '@cf/openai/gpt-oss-120b');
  assert.equal(seen.body.reasoning.effort, 'low');
  assert.equal(seen.body.max_output_tokens >= 8192, true);
  await assert.rejects(chatJson({ system: 's', user: 'u' }, { env: {} }), /required/);
}

// ---------------- approved files: TS module round-trips and registers ----------------
{
  const tmp = mkdtempSync(path.join(tmpdir(), 'blog-auto-'));
  try {
    mkdirSync(path.join(tmp, 'src/data/blogPosts'), { recursive: true });
    copyFileSync(path.join(root, 'src/data/blog.ts'), path.join(tmp, 'src/data/blog.ts'));
    const tricky = goodPost();
    tricky.sections[0].paragraphs[1].en += " It's a \\ backslash and a 'quote'.\nNew line.";
    const written = writeApproved(tmp, { post: tricky, ledger: goodLedger(), reports: [passReport] });
    assert.deepEqual(written.slice(1), ['src/data/blogReviews/workers-kv-test-post.claims.json', 'src/data/blogReviews/workers-kv-test-post.review.json', 'src/data/blog.ts']);
    const mod = await import(pathToFileURL(path.join(tmp, written[0])).href);
    assert.deepEqual(clone(Object.values(mod)[0]), clone(tricky), 'rendered TS imports back to the same post');
    assert.equal(publishedOnDisk('workers-kv-test-post', path.join(tmp, 'src/data/blogPosts')), true, 'legacy published detector sees it');
    const blogTs = readFileSync(path.join(tmp, 'src/data/blog.ts'), 'utf8');
    assert.match(blogTs, /import \{ postWorkersKvTestPost \} from '\.\/blogPosts\/workers-kv-test-post';/);
    assert.equal(countBlogWordsIsCorrupted(blogTs), false);
    assert.deepEqual(validate(REVIEW_REPORT_SCHEMA, JSON.parse(readFileSync(path.join(tmp, written[2]), 'utf8'))), []);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// rule ids with digits (I18N-…) are valid in reports
assert.deepEqual(validate(REVIEW_REPORT_SCHEMA, { ...passReport, findings: [{ rule: 'I18N-002', category: 'bilingual', severity: 'major', message: 'x' }] }), []);

// ---------------- committed schema file matches the code ----------------
const committed = JSON.parse(readFileSync(path.join(root, 'docs/blog/review-report.schema.json'), 'utf8'));
assert.deepEqual(committed, JSON.parse(JSON.stringify(REVIEW_REPORT_SCHEMA)), 'regenerate docs/blog/review-report.schema.json');

// ---------------- real repo context loads; reference diagram slugs resolve ----------------
const repoCtx = buildCheckContext(root, { today: '2026-11-22', allowExistingSlug: true });
assert.ok(repoCtx.diagramSlugs.has('fullstack-application'));
assert.ok(repoCtx.postSlugs.size >= 30);

console.log('test-blog-review: all assertions passed');
