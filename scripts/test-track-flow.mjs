/**
 * PR1 track schema: lesson kinds, stable URLs, and knowledge → hub lab → official lab.
 * Loads the TypeScript data modules through Vite, same as the Astro build.
 */
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { inferLessonKind } = await vite.ssrLoadModule('/src/data/lessonKind.ts');
  const { getTrackFlow } = await vite.ssrLoadModule('/src/data/trackFlow.ts');
  const { getAllFlatTrackLessons } = await vite.ssrLoadModule('/src/data/trackLessons.ts');
  const { TRACK_DISPLAY_ORDER } = await vite.ssrLoadModule('/src/data/trackCatalog.ts');
  const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts');

  assert.equal(inferLessonKind('as-0'), 'knowledge');
  assert.equal(inferLessonKind('as-3'), 'lab-hub');
  assert.equal(inferLessonKind('as-7'), 'lab-hub');
  assert.equal(inferLessonKind('dp-0'), 'knowledge');
  assert.equal(inferLessonKind('dp-1'), 'lab-hub');
  assert.equal(inferLessonKind('c1-1'), 'knowledge');
  assert.equal(inferLessonKind('c1-9'), 'knowledge');
  assert.equal(inferLessonKind('c1-4'), 'lab-hub');
  assert.equal(inferLessonKind('asa-1'), 'knowledge');
  assert.equal(inferLessonKind('oe-5'), 'knowledge');
  assert.equal(inferLessonKind('as-3', 'knowledge'), 'knowledge');

  const lessons = getAllFlatTrackLessons();
  assert.ok(lessons.length > 0, 'expected track lessons');
  const ids = lessons.map((lesson) => `${lesson.trackSlug}/${lesson.id}`);
  assert.equal(new Set(ids).size, ids.length, 'lesson ids must stay unique');

  for (const lesson of lessons) {
    assert.match(lesson.id, new RegExp(`^${lesson.moduleId}-l\\d+$`));
    const expected =
      lesson.moduleId === 'as-0' ||
      lesson.moduleId === 'dp-0' ||
      lesson.moduleId === 'c1-1' ||
      lesson.moduleId === 'c1-9' ||
      lesson.moduleId.startsWith('asa-') ||
      lesson.moduleId.startsWith('oe-')
        ? 'knowledge'
        : 'lab-hub';
    assert.equal(inferLessonKind(lesson.moduleId, lesson.kind), expected, lesson.id);
  }

  assert.deepEqual(
    tracks.map((track) => track.slug),
    [
      'application-services',
      'developer-platform',
      'cloudflare-one',
      'ai-security-adoption',
      'operational-excellence',
    ],
  );
  assert.deepEqual(
    TRACK_DISPLAY_ORDER,
    tracks.map((track) => track.slug),
  );

  const asFlow = getTrackFlow('application-services');
  assert.equal(
    asFlow.some((item) => item.kind === 'lab-official'),
    false,
  );
  assert.equal(asFlow[0].key, 'as-0-l1');
  assert.equal(asFlow[0].kind, 'knowledge');
  assert.equal(asFlow[1].key, 'as-1-l1');
  assert.equal(asFlow[1].kind, 'lab-hub');
  assert.deepEqual(asFlow[1].prerequisiteIds, ['as-0-l1']);
  assert.equal(asFlow.find((item) => item.key === 'as-3-l1')?.kind, 'lab-hub');

  for (const slug of ['ai-security-adoption', 'operational-excellence']) {
    const flow = getTrackFlow(slug);
    assert.ok(
      flow.every((item) => item.kind === 'knowledge'),
      `${slug} stays knowledge in PR1`,
    );
    assert.equal(
      flow.some((item) => item.kind === 'lab-official'),
      false,
    );
  }

  const dp = getTrackFlow('developer-platform');
  const workersAt = dp.findIndex((item) => item.key === 'official:workers');
  assert.ok(workersAt > 0, 'workers official lab is in the DP flow');
  assert.equal(dp[workersAt].kind, 'lab-official');
  assert.equal(dp[workersAt - 1].moduleId, 'dp-1');
  assert.equal(dp[workersAt - 1].kind, 'lab-hub');
  assert.equal(dp[workersAt + 1].moduleId, 'dp-2');
  assert.equal(dp.filter((item) => item.key === 'official:workers').length, 1);
  assert.equal(dp.filter((item) => item.kind === 'lab-official').length, 4);
  assert.equal(dp[0].key, 'dp-0-l1');
  assert.equal(dp[0].kind, 'knowledge');

  const hrefs = new Set(lessons.map((lesson) => `/tracks/${lesson.trackSlug}/${lesson.id}/`));
  for (const item of dp.concat(asFlow)) {
    if (item.kind === 'lab-official') {
      assert.match(item.href, /^\/tracks\/developer-platform\/labs\/[a-z0-9-]+\/$/);
    } else {
      assert.ok(hrefs.has(item.href), item.href);
    }
  }

  console.log(`✓ track flow: ${lessons.length} lessons, ${hrefs.size} stable lesson URLs`);
} finally {
  await vite.close();
}
