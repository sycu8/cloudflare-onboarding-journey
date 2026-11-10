/**
 * Blog cadence: scaffold registration must not touch countBlogWords, and the
 * approve job must isolate slug failures without a force push.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyScaffoldRegistration,
  arrayEntryNames,
  countBlogWordsIsCorrupted,
  countBlogWordsSource,
  locateBlogPostsArray,
} from './blog-register-scaffold.mjs';
import {
  assertJobShape,
  assertNoForce,
  collectJobs,
  decidePush,
  formatFailureReport,
  openScaffoldForJob,
  remoteBranchFetchRefspec,
  runApproveJobs,
} from './blog-on-approve.mjs';
import { resolveEditorialTargets, ScheduleMissError, splitCsv } from './blog-editorial.mjs';
import { postArgoSmartRoutingGiamDoTre } from '../src/data/blogPosts/argo-smart-routing-giam-do-tre.ts';
import { postEmailRoutingVaEmailWorkers } from '../src/data/blogPosts/email-routing-va-email-workers.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function countWords(post, lang) {
  const parts = [
    post.title[lang],
    post.description[lang],
    ...post.sections.flatMap((section) => [section.heading[lang], ...section.paragraphs.map((p) => p[lang])]),
    ...post.faq.flatMap((item) => [item.question[lang], item.answer[lang]]),
  ];
  return parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

const fixture = `import type { BlogPost } from '../blog';
import { postExample } from './blogPosts/example';

export const blogPosts: BlogPost[] = [
  postExample,
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function countBlogWords(post: BlogPost, lang: 'vi' | 'en'): number {
  const parts: string[] = [
    post.title[lang],
    post.description[lang],
  ];
  return parts.join(' ').trim().split(/\\s+/).filter(Boolean).length;
}
`;

const oldFirstBracket = /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/;
const oldMatch = fixture.match(oldFirstBracket);
assert.ok(oldMatch, 'fixture must contain a ]; so the old bug is reachable');
assert.match(oldMatch[1], /countBlogWords/, 'the old first-]; match reaches into countBlogWords');
assert.match(oldMatch[1], /const parts/);

const updated = applyScaffoldRegistration(fixture, [
  { exportName: 'postNewSlug', stem: 'new-slug' },
]);
assert.equal(countBlogWordsSource(fixture), countBlogWordsSource(updated));
assert.equal(countBlogWordsIsCorrupted(updated), false);
const inserted = locateBlogPostsArray(updated);
assert.deepEqual(arrayEntryNames(inserted.inner), ['postExample', 'postNewSlug']);
assert.match(updated, /import \{ postNewSlug \} from '\.\/blogPosts\/new-slug';/);
assert.doesNotMatch(countBlogWordsSource(updated), /postNewSlug/);

const twice = applyScaffoldRegistration(updated, [{ exportName: 'postNewSlug', stem: 'new-slug' }]);
assert.equal(twice, updated);

const realBlog = readFileSync(path.join(root, 'src/data/blog.ts'), 'utf8');
const realWords = countBlogWordsSource(realBlog);
const registered = applyScaffoldRegistration(realBlog, [
  { exportName: 'postEmailRoutingVaEmailWorkers', stem: 'email-routing-va-email-workers' },
  { exportName: 'postArgoSmartRoutingGiamDoTre', stem: 'argo-smart-routing-giam-do-tre' },
]);
assert.equal(registered, realBlog, 'real blog.ts should already register both posts');
assert.equal(countBlogWordsSource(registered), realWords);
assert.equal(countBlogWordsIsCorrupted(realBlog), false);
assert.ok(arrayEntryNames(locateBlogPostsArray(realBlog).inner).includes('postEmailRoutingVaEmailWorkers'));
assert.ok(arrayEntryNames(locateBlogPostsArray(realBlog).inner).includes('postArgoSmartRoutingGiamDoTre'));

const corrupted = realBlog.replace(
  '  return parts.join',
  '  postEmailRoutingVaEmailWorkers,\n  return parts.join',
);
assert.equal(countBlogWordsIsCorrupted(corrupted), true);

const queue = [
  { date: '2026-10-26', slug: 'hyperdrive-ket-noi-postgres-nhanh-hon' },
  { date: '2026-10-29', slug: 'browser-rendering-chup-va-tuong-tac-trang' },
  { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
  { date: '2026-11-04', slug: 'argo-smart-routing-giam-do-tre' },
];

assert.equal(resolveEditorialTargets(queue, {}), null);
assert.deepEqual(
  resolveEditorialTargets(queue, { slug: 'hyperdrive-ket-noi-postgres-nhanh-hon' }).map((row) => row.date),
  ['2026-10-26'],
);
assert.deepEqual(
  resolveEditorialTargets(queue, {
    slug: 'hyperdrive-ket-noi-postgres-nhanh-hon, browser-rendering-chup-va-tuong-tac-trang',
  }).map((row) => row.slug),
  ['hyperdrive-ket-noi-postgres-nhanh-hon', 'browser-rendering-chup-va-tuong-tac-trang'],
);
assert.equal(resolveEditorialTargets(queue, { date: '2026-10-29' })[0].slug, 'browser-rendering-chup-va-tuong-tac-trang');
assert.throws(
  () => resolveEditorialTargets(queue, { date: '2026-10-26', slug: 'browser-rendering-chup-va-tuong-tac-trang' }),
  ScheduleMissError,
);
assert.throws(() => resolveEditorialTargets(queue, { slug: 'missing-slug' }), ScheduleMissError);
const soft = (() => {
  try {
    resolveEditorialTargets(queue, { date: '2026-01-01' });
    return null;
  } catch (error) {
    return error;
  }
})();
assert.ok(soft instanceof ScheduleMissError);
assert.equal(soft.emailBodySoft, true);
assert.deepEqual(splitCsv(' a, b ,c '), ['a', 'b', 'c']);

assert.deepEqual(
  collectJobs({
    event: 'schedule',
    polledRows: [
      { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
      { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
      { date: '2026-11-04', slug: 'argo-smart-routing-giam-do-tre' },
    ],
  }),
  [
    { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
    { date: '2026-11-04', slug: 'argo-smart-routing-giam-do-tre' },
  ],
);
assert.deepEqual(
  collectJobs({
    event: 'workflow_dispatch',
    inputDate: '2026-11-07',
    inputSlug: 'waiting-room-bao-ve-khi-traffic-bung',
    polledRows: [{ date: '2026-11-01', slug: 'email-routing-va-email-workers' }],
  }),
  [{ date: '2026-11-07', slug: 'waiting-room-bao-ve-khi-traffic-bung' }],
);

const createPlan = decidePush({
  branch: 'blog/argo-smart-routing-giam-do-tre',
  remoteExists: false,
  isAncestor: false,
});
assert.equal(createPlan.action, 'create');
assert.deepEqual(createPlan.args, [
  'push',
  '-u',
  'origin',
  'HEAD:refs/heads/blog/argo-smart-routing-giam-do-tre',
]);
assertNoForce(createPlan.args);

const ffPlan = decidePush({
  branch: 'blog/argo-smart-routing-giam-do-tre',
  remoteExists: true,
  isAncestor: true,
});
assert.equal(ffPlan.action, 'fast-forward');
assertNoForce(ffPlan.args);

const refusePlan = decidePush({
  branch: 'blog/email-routing-va-email-workers',
  remoteExists: true,
  isAncestor: false,
});
assert.equal(refusePlan.action, 'refuse');
assert.deepEqual(refusePlan.args, []);
assert.match(refusePlan.reason, /refusing to force-push/);
assert.equal(
  remoteBranchFetchRefspec('blog/email-routing-va-email-workers'),
  'refs/heads/blog/email-routing-va-email-workers:refs/remotes/origin/blog/email-routing-va-email-workers',
);
assert.throws(() => assertNoForce(['push', '--force-with-lease']), /force push is not allowed/);
assert.throws(() => assertJobShape({ date: '11-01', slug: 'not safe' }), /invalid schedule job/);

const resets = [];
const isolated = await runApproveJobs(
  [
    { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
    { date: '2026-11-04', slug: 'argo-smart-routing-giam-do-tre' },
  ],
  {
    async handle(job) {
      if (job.slug.startsWith('email-routing')) {
        throw new Error('stale info from shallow checkout');
      }
      return { status: 'opened', slug: job.slug };
    },
    async reset() {
      resets.push('reset');
    },
  },
);
assert.equal(isolated.exitCode, 1);
assert.equal(isolated.ok.length, 1);
assert.equal(isolated.ok[0].slug, 'argo-smart-routing-giam-do-tre');
assert.deepEqual(resets, ['reset']);
assert.match(formatFailureReport(isolated.failures), /Failed slugs:/);
assert.match(formatFailureReport(isolated.failures), /email-routing-va-email-workers: stale info/);
assert.doesNotMatch(formatFailureReport([]), /Failed/);

const workflow = readFileSync(path.join(root, '.github/workflows/blog-on-approve.yml'), 'utf8');
assert.match(workflow, /fetch-depth:\s*0/);
assert.match(workflow, /node scripts\/blog-on-approve\.mjs/);
assert.doesNotMatch(workflow, /git push/);
assert.doesNotMatch(workflow, /--force-with-lease/);
assert.match(
  readFileSync(path.join(root, '.github/workflows/blog-biweekly-email.yml'), 'utf8'),
  /hyperdrive-ket-noi-postgres-nhanh-hon,browser-rendering-chup-va-tuong-tac-trang/,
);

const pushCalls = [];
await openScaffoldForJob(
  { date: '2026-11-04', slug: 'argo-smart-routing-giam-do-tre' },
  {
    async isPublished() {
      return false;
    },
    async git(args) {
      pushCalls.push(args.join(' '));
      if (args[0] === 'fetch' && String(args.at(-1)).startsWith('refs/heads/blog/')) {
        throw new Error('remote branch missing');
      }
    },
    async readBlogTs() {
      throw new Error('should not read blog.ts when the remote branch is missing');
    },
    async scaffold() {},
    async register() {},
    async prompt() {
      return 'prompt';
    },
    async hasStagedChanges() {
      return true;
    },
    async isAncestor() {
      return false;
    },
    async writePrBody() {},
    async gh() {},
    async prLine() {
      return 'PR #1 https://example.com/pull/1';
    },
    prBodyPath: '/tmp/pr-body.md',
    async notify() {},
  },
);
assert.ok(pushCalls.some((line) => line.startsWith('push -u origin HEAD:refs/heads/blog/argo-smart-routing-giam-do-tre')));
assert.equal(pushCalls.some((line) => line.includes('force')), false);

const refused = [];
await assert.rejects(
  () =>
    openScaffoldForJob(
      { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
      {
        async isPublished() {
          return false;
        },
        async git(args) {
          refused.push(args.join(' '));
        },
        async readBlogTs() {
          return corrupted;
        },
        async scaffold() {
          throw new Error('should not scaffold a broken branch');
        },
        async register() {},
        async prompt() {
          return '';
        },
        async hasStagedChanges() {
          return false;
        },
        async isAncestor() {
          return false;
        },
        async writePrBody() {},
        async gh() {},
        async prLine() {
          return '';
        },
        prBodyPath: '/tmp/pr-body.md',
      },
    ),
  /refusing to force-push or reuse it/,
);
assert.equal(refused.some((line) => line.startsWith('push')), false);

await openScaffoldForJob(
  { date: '2026-11-01', slug: 'email-routing-va-email-workers' },
  {
    async isPublished() {
      return true;
    },
    async git() {
      throw new Error('published slug must not touch git');
    },
  },
);

for (const post of [postEmailRoutingVaEmailWorkers, postArgoSmartRoutingGiamDoTre]) {
  const vi = countWords(post, 'vi');
  const en = countWords(post, 'en');
  assert.ok(vi >= 400, `${post.slug} vi words ${vi} < 400`);
  assert.ok(en >= 400, `${post.slug} en words ${en} < 400`);
  assert.ok(post.faq.length >= 3, `${post.slug} needs FAQ`);
  assert.ok(post.sources.length >= 2, `${post.slug} needs sources`);
  assert.equal(post.sections.some((section) => section.paragraphs.some((p) => p.vi.includes('TODO'))), false);
}

console.log('blog cadence tests passed');
console.log(
  'words',
  'email',
  countWords(postEmailRoutingVaEmailWorkers, 'vi'),
  countWords(postEmailRoutingVaEmailWorkers, 'en'),
  'argo',
  countWords(postArgoSmartRoutingGiamDoTre, 'vi'),
  countWords(postArgoSmartRoutingGiamDoTre, 'en'),
);
