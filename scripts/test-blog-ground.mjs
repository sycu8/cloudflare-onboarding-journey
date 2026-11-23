/**
 * Quote grounding: short quotes, invented quotes, and uncited numbers
 * from the snippets hold (FACT-001 / FACT-004 / FACT-008) are fixed in
 * code. The gate itself is unchanged.
 */
import assert from 'node:assert/strict';
import { runDeterministicChecks } from './lib/blog-review/checks.mjs';
import { postWordCount } from './lib/blog-review/checks.mjs';
import { failingClaimBrief, groundDraft, stripReviewedSentences } from './lib/blog-review/ground.mjs';
import { splitDraft } from './lib/blog-review/pipeline.mjs';
import { discoverLinkedDocs, quoteFound } from './lib/blog-review/sources.mjs';
import { validate, CLAIMS_LEDGER_SCHEMA } from './lib/blog-review/schema.mjs';

const DOC = 'https://developers.cloudflare.com/rules/snippets/';
const PAGE = [
  '# Cloudflare Snippets',
  '',
  "Cloudflare Snippets allow you to run short pieces of JavaScript code on Cloudflare's network to customize how requests and responses are handled for your website or application.",
  '',
  'Snippets require that you proxy the DNS records of your domain or subdomain through Cloudflare.',
].join('\n');
const VERBATIM = "Cloudflare Snippets allow you to run short pieces of JavaScript code on Cloudflare's network to customize how requests and responses are handled for your website or application.";

const ctx = {
  diagramSlugs: new Set(),
  postSlugs: new Set(),
  allowExistingSlug: true,
  fileSize: () => null,
  readText: () => null,
  today: '2026-11-23',
};

function paragraph(en, vi) {
  return {
    vi: vi || 'Đoạn này mô tả Cloudflare Snippets bằng tiếng Việt có dấu.',
    en,
  };
}

function post() {
  return {
    slug: 'snippets-javascript-tren-edge',
    title: { vi: 'Cloudflare Snippets trên edge', en: 'Cloudflare Snippets at the edge' },
    description: {
      vi: 'Giải thích Snippets cho người mới, không nêu số liệu khi tài liệu không có.',
      en: 'A beginner explanation of Snippets without figures the docs do not state.',
    },
    excerpt: {
      vi: 'Snippets chạy JavaScript ngắn trên mạng Cloudflare.',
      en: 'Snippets run short JavaScript on the Cloudflare network.',
    },
    keywords: { vi: 'snippets, edge, javascript', en: 'snippets, edge, javascript' },
    sections: [
      { heading: { vi: 'Snippets là gì', en: 'What Snippets are' }, paragraphs: [paragraph('Snippets customize requests on the Cloudflare network.')] },
      { heading: { vi: 'Khi nào dùng', en: 'When to use them' }, paragraphs: [paragraph('Use Snippets for small request changes.')] },
      {
        heading: { vi: 'Giới hạn', en: 'Limits' },
        paragraphs: [paragraph('The Free plan allows 32 ms of CPU time per request.')],
      },
    ],
    faq: [
      { question: { vi: 'Snippets có cần proxy không?', en: 'Do Snippets need a proxied record?' }, answer: { vi: 'Có, bản ghi DNS phải đi qua Cloudflare.', en: 'Yes. The DNS record must be proxied through Cloudflare.' } },
      { question: { vi: 'Khác Workers thế nào?', en: 'How is this different from Workers?' }, answer: { vi: 'Snippets dành cho thay đổi nhỏ của request.', en: 'Snippets are for small request changes.' } },
      { question: { vi: 'Gói nào được dùng?', en: 'Which plan includes them?' }, answer: { vi: 'Gói Free cho phép 1000 requests mỗi ngày.', en: 'The Free plan includes 1000 requests each day.' } },
    ],
    sources: [{ title: 'Cloudflare Snippets', href: DOC }],
    relatedProductSlugs: [],
    relatedPostSlugs: [],
    hubLinks: [
      { href: '/products/workers/', label: { vi: 'Workers', en: 'Workers' } },
      { href: '/blog/', label: { vi: 'Blog', en: 'Blog' } },
    ],
    diagramSlugs: [],
    readingMinutes: 3,
    topic: 'workers',
    level: 'entry',
    date: '2026-11-22',
  };
}

function claim(id, location, text, quote) {
  return { id, location, text, sourceUrl: DOC, quote };
}

const ledger = {
  slug: 'snippets-javascript-tren-edge',
  claims: [
    claim('C002', 's0.p0', 'Snippets execute arbitrary binaries on the origin.', 'Snippets execute arbitrary binaries on the origin server always.'),
    claim('C004', 's1.p0', 'Snippets replace the whole Workers runtime.', 'Snippets replace the whole Workers runtime for every zone.'),
    claim('C005', 'excerpt', 'Snippets run short JavaScript on the Cloudflare network.', 'short quote'),
    claim('C006', 's0.p0', 'Pieces of JavaScript run on the Cloudflare network.', 'JS bits'),
    claim('C007', 'faq0.a', 'Proxy the DNS records through Cloudflare.', 'proxy dns'),
    claim('C008', 's1.p0', 'Snippets mine cryptocurrency at the edge.', 'Snippets mine cryptocurrency at the edge for every request today.'),
  ],
};

assert.equal(quoteFound(PAGE, 'short quote'), false);
assert.ok(validate(CLAIMS_LEDGER_SCHEMA, ledger).length > 0, 'quotes under 20 characters fail FACT-001 schema');

const grounded = groundDraft(post(), ledger, { [DOC]: PAGE });
assert.deepEqual(validate(CLAIMS_LEDGER_SCHEMA, grounded.ledger), [], grounded.notes.join('; '));
for (const item of grounded.ledger.claims) {
  assert.ok(item.quote.length >= 20, item.id);
  assert.equal(quoteFound(PAGE, item.quote), true, `${item.id} quote must be verbatim`);
}
const ids = grounded.ledger.claims.map((item) => item.id);
assert.ok(ids.includes('C005'), 'short quote snaps to the docs sentence');
assert.equal(grounded.ledger.claims.find((item) => item.id === 'C005').quote, VERBATIM);
assert.ok(!ids.includes('C002') && !ids.includes('C004') && !ids.includes('C008'), 'invented quotes are dropped');

const factRules = new Set(runDeterministicChecks(grounded.post, grounded.ledger, ctx).filter((f) => f.rule.startsWith('FACT-')).map((f) => f.rule));
assert.ok(!factRules.has('FACT-001'), 'short quotes no longer fail the ledger schema');
assert.ok(!factRules.has('FACT-004'), `uncited Free plan / 32 ms / 1000 requests removed: ${[...factRules].join(',')}`);
assert.equal(/32 ms|1000 requests|Free plan/i.test(JSON.stringify(grounded.post)), false);

const report = {
  findings: [
    { rule: 'FACT-008', category: 'factual', severity: 'blocker', message: 'Claim C006: quote not found verbatim on https://developers.cloudflare.com/rules/snippets/.', location: 's0.p0' },
    { rule: 'FACT-004', category: 'factual', severity: 'blocker', message: 'States a number, limit, price, date or plan without a claim in the ledger.', location: 's2.p1' },
  ],
};
const brief = failingClaimBrief(report, ledger, { [DOC]: PAGE });
assert.match(brief, /FACT-008 C006/);
assert.match(brief, /FACT-004/);
assert.match(brief, /closest verbatim/);
assert.match(brief, /Cloudflare Snippets allow you to run short pieces/);

const misplaced = groundDraft(post(), {
  slug: 'snippets-javascript-tren-edge',
  claims: [claim('C009', 'faq0.q0', 'Proxy the DNS records through Cloudflare.', 'proxy dns')],
}, { [DOC]: PAGE });
assert.equal(misplaced.ledger.claims[0].location, 'faq0.q');
assert.equal(quoteFound(PAGE, misplaced.ledger.claims[0].quote), true);

const empty = post();
empty.sections.push({
  heading: { vi: 'Phần trống', en: 'Empty section' },
  paragraphs: [{ vi: '', en: '' }, { vi: '   ', en: '' }],
});
const cleaned = groundDraft(empty, { slug: empty.slug, claims: [claim('C005', 'excerpt', 'Snippets run short JavaScript on the Cloudflare network.', 'short quote')] }, { [DOC]: PAGE });
assert.equal(cleaned.post.sections.find((section) => section.heading.en === 'Empty section').paragraphs.length, 0);
assert.ok(postWordCount(cleaned.post, 'en') >= 400);
assert.ok(postWordCount(cleaned.post, 'vi') >= 400);

const freePlan = groundDraft(post(), {
  slug: 'snippets-javascript-tren-edge',
  claims: [claim('C011', 's2.p1', 'Snippets cannot run on free plans.', 'Snippets are unavailable on the free plan for every zone.')],
}, { [DOC]: PAGE });
assert.ok(!freePlan.ledger.claims.some((item) => item.id === 'C011'), 'a free-plan claim is not snapped onto an unrelated sentence');
assert.equal(/free plan/i.test(freePlan.post.sections[2].paragraphs[0].en), false);

const stripped = stripReviewedSentences(post(), {
  findings: [{
    rule: 'FACT-012',
    message: 'Uncited Cloudflare claim: The Free plan allows 32 ms of CPU time per request.',
    location: 's2.p0',
  }],
});
assert.equal(/32 ms/i.test(stripped.sections[2].paragraphs[0].en), false);

assert.deepEqual(
  discoverLinkedDocs('https://developers.cloudflare.com/rules/snippets/', 'See [how](https://developers.cloudflare.com/rules/snippets/how-it-works/) and ![x](https://developers.cloudflare.com/rules/snippets/og.png).'),
  ['https://developers.cloudflare.com/rules/snippets/how-it-works/'],
);

const wrapped = splitDraft({ post: post(), ledger: { claims: [claim('C005', 'excerpt', 'Snippets run short JavaScript on the Cloudflare network.', VERBATIM)] } });
assert.equal(wrapped.ledger.claims.length, 1);
assert.equal(wrapped.post.slug, 'snippets-javascript-tren-edge');

console.log('test-blog-ground: all assertions passed');
