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
  const { inferLessonKind, parseDurationMinutes } = await vite.ssrLoadModule('/src/data/lessonKind.ts');
  const { getTrackFlow, sumFlowMinutes } = await vite.ssrLoadModule('/src/data/trackFlow.ts');
  const { getAllFlatTrackLessons } = await vite.ssrLoadModule('/src/data/trackLessons.ts');
  const { TRACK_DISPLAY_ORDER } = await vite.ssrLoadModule('/src/data/trackCatalog.ts');
  const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts');

  assert.equal(inferLessonKind('as-0'), 'knowledge');
  assert.equal(inferLessonKind('as-3'), 'lab-hub');
  assert.equal(inferLessonKind('as-7'), 'reference');
  assert.equal(inferLessonKind('dp-7'), 'reference');
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
    const autoId = new RegExp(`^${lesson.moduleId}-l\\d+$`);
    const knowledgeId = /^(as|dp)-k-[a-z]+$/;
    assert.ok(autoId.test(lesson.id) || knowledgeId.test(lesson.id), lesson.id);
    const fromModule =
      lesson.moduleId === 'as-7' || lesson.moduleId === 'dp-7'
        ? 'reference'
        : lesson.moduleId === 'as-0' ||
            lesson.moduleId === 'dp-0' ||
            lesson.moduleId === 'c1-1' ||
            lesson.moduleId === 'c1-9' ||
            lesson.moduleId.startsWith('asa-') ||
            lesson.moduleId.startsWith('oe-')
          ? 'knowledge'
          : 'lab-hub';
    assert.equal(inferLessonKind(lesson.moduleId, lesson.kind), lesson.kind ?? fromModule, lesson.id);
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
  assert.equal(asFlow[1].key, 'as-k-dns');
  assert.equal(asFlow[1].kind, 'knowledge');
  assert.equal(asFlow[2].key, 'as-1-l1');
  assert.equal(asFlow[2].kind, 'lab-hub');
  assert.deepEqual(asFlow[2].prerequisiteIds, ['as-k-dns']);
  assert.equal(asFlow.find((item) => item.key === 'as-3-l1')?.kind, 'lab-hub');
  assert.deepEqual(asFlow.find((item) => item.key === 'as-3-l1')?.prerequisiteIds, ['as-k-waf']);
  const wafAt = asFlow.findIndex((item) => item.key === 'as-k-waf');
  assert.equal(asFlow[wafAt + 1].key, 'as-3-l1');
  const knowledgeLessons = lessons.filter((lesson) => String(lesson.id).startsWith('as-k-'));
  assert.equal(knowledgeLessons.length, 6);
  for (const lesson of knowledgeLessons) {
    assert.ok(lesson.guide?.how?.vi && lesson.guide?.how?.en, `${lesson.id} guide`);
    assert.ok(lesson.guide.whenToUse.vi && lesson.guide.whenNot.en);
    assert.ok(lesson.guide.planNotes.vi && lesson.guide.planNotes.en);
    assert.ok(lesson.title.vi && lesson.title.en && lesson.body.vi && lesson.body.en);
  }
  assert.equal(asFlow.find((item) => item.key === 'as-7-l1')?.kind, 'reference');
  assert.equal(asFlow.find((item) => item.key === 'as-7-l2')?.kind, 'reference');
  assert.deepEqual(asFlow[0].prerequisiteIds, []);

  for (const slug of TRACK_DISPLAY_ORDER) {
    const flow = getTrackFlow(slug);
    const total = sumFlowMinutes(flow);
    assert.equal(sumFlowMinutes(flow), total, `${slug} total is stable`);
    assert.ok(total > 0, `${slug} has a total`);
    flow.forEach((item, index) => {
      assert.ok(item.duration, `${item.key} has a duration`);
      const minutes = parseDurationMinutes(item.duration.vi);
      assert.ok(minutes > 0, `${item.key} duration has a time`);
      assert.equal(item.minutes, minutes, `${item.key} minutes match the badge`);
      const isLab = item.kind === 'lab-hub' || item.kind === 'lab-official';
      if (isLab && index > 0) {
        assert.ok(item.prerequisiteIds.length > 0, `${item.key} lab has a prerequisite`);
      }
    });
    assert.deepEqual(flow[0].prerequisiteIds, [], `${slug} first lesson has no lesson prerequisite`);
  }

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
  const mcp = dp.find((item) => item.key === 'official:mcp');
  assert.ok(mcp.prerequisiteIds.includes('dp-5-l5'));
  assert.equal(mcp.prerequisiteIds.includes('dp-3-l3'), false);
  const sandbox = dp.find((item) => item.key === 'official:sandbox-sdk');
  assert.equal(sandbox.prerequisiteIds.at(-1), 'dp-5-l5');
  assert.equal(sandbox.prerequisiteIds.includes('dp-4-l2'), false);
  assert.equal(sandbox.prerequisiteIds.includes('dp-5-l1'), false);
  const sandboxAt = dp.findIndex((item) => item.key === 'official:sandbox-sdk');
  const aiLabAt = dp.findIndex((item) => item.key === 'dp-5-l5');
  assert.ok(sandboxAt > aiLabAt, 'sandbox official lab follows the AI hub labs');
  assert.equal(dp[dp.findIndex((item) => item.key === 'official:workers') - 1].key, 'dp-1-l2');
  assert.equal(dp.find((item) => item.key === 'dp-k-worker')?.kind, 'knowledge');
  assert.deepEqual(dp.find((item) => item.key === 'dp-1-l1')?.prerequisiteIds, ['dp-k-worker']);
  const dpLessons = lessons.filter((lesson) => lesson.trackSlug === 'developer-platform');
  for (const lesson of dpLessons) {
    assert.ok(lesson.duration?.vi && lesson.duration?.en, `${lesson.id} duration`);
    assert.ok(parseDurationMinutes(lesson.duration.vi) > 0, `${lesson.id} duration minutes`);
    if (lesson.id !== 'dp-0-l1') {
      const ids = lesson.prerequisites?.length ? lesson.prerequisites : lesson.dependsOn;
      assert.ok(ids?.length, `${lesson.id} has prerequisites or dependsOn`);
    }
  }
  for (const id of ['dp-k-worker', 'dp-k-pages', 'dp-k-storage', 'dp-k-operate', 'dp-k-ai', 'dp-k-stateful']) {
    const lesson = dpLessons.find((entry) => entry.id === id);
    assert.ok(lesson?.guide?.how?.vi && lesson.guide.how.en, `${id} guide`);
    assert.ok(lesson.title.vi && lesson.title.en && lesson.body.vi && lesson.body.en);
    assert.equal(/2026/.test(lesson.title.vi + lesson.title.en), false);
  }
  assert.equal(/2026/.test(dpLessons.find((entry) => entry.id === 'dp-0-l1').title.en), false);

  const paidAsFree = /usually need (workers )?paid|thường cần (workers )?paid|unlocks features \(do|18\.17|hạn chế \/ không|limited \/ no/i;
  const dpText = [];
  const walkDp = (value) => {
    if (typeof value === 'string') dpText.push(value);
    else if (Array.isArray(value)) value.forEach(walkDp);
    else if (value && typeof value === 'object') Object.values(value).forEach(walkDp);
  };
  walkDp(dpLessons);
  assert.ok(getTrackFlow('ai-security-adoption').every((item) => item.minutes > 0));

  const asLabs = asFlow.filter((item) => item.kind === 'lab-hub');
  const asKeys = new Set(asFlow.map((item) => item.key));
  for (const lab of asLabs) {
    assert.ok(lab.prerequisiteIds.length > 0, `${lab.key} dependsOn`);
    for (const id of lab.prerequisiteIds) assert.ok(asKeys.has(id), `${lab.key} -> ${id}`);
  }
  for (const id of ['as-k-dns', 'as-k-ssl', 'as-k-waf', 'as-k-cache', 'as-k-api', 'as-k-traffic']) {
    const item = asFlow.find((entry) => entry.key === id);
    assert.ok(item, id);
    assert.ok(item.title.vi && item.title.en, `${id} title`);
    assert.ok(item.summary.vi && item.summary.en, `${id} summary`);
  }

  const { applicationServicesFollowAlong } = await vite.ssrLoadModule('/src/data/followAlong/applicationServices.ts');
  const { developerPlatformFollowAlong } = await vite.ssrLoadModule('/src/data/followAlong/developerPlatform.ts');
  walkDp(developerPlatformFollowAlong);
  for (const text of dpText) {
    assert.equal(paidAsFree.test(text), false, text.slice(0, 140));
    if (/vectorize/i.test(text) && /\bfree\b/i.test(text)) {
      assert.match(text, /dashboard|docs|paid|does not assign|không gán/i, text.slice(0, 140));
    }
  }
  const { trackLessonEnrichment } = await vite.ssrLoadModule('/src/data/trackLessons.ts');
  const { trackLessonBestPractices } = await vite.ssrLoadModule('/src/data/trackLessonBestPractices.ts');

  const lessonStrings = [];
  const walk = (value, path) => {
    if (typeof value === 'string') lessonStrings.push({ path, value });
    else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${path}[${index}]`));
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        if (key === 'url' || key === 'href' || key === 'sourceUrl') continue;
        walk(child, `${path}.${key}`);
      }
    }
  };
  for (const lesson of lessons) walk(lesson, lesson.id);
  walk(applicationServicesFollowAlong, 'as-follow');
  walk(developerPlatformFollowAlong, 'dp-follow');
  walk(trackLessonEnrichment, 'enrichment');
  walk(trackLessonBestPractices, 'best-practice');

  const logAction = /log\s*\/\s*simulate|simulate\s*\/\s*log|\bwaf simulate\b|\blog mode\b|\b(in|ở) log\b(?!\/monitor)|\bthen:\s*log\b|→\s*log\b|log rồi block|log then block|\blog 24|\bwaf log\b|chế độ log|action mặc định là log|default action to log/i;
  for (const item of lessonStrings) {
    if (!logAction.test(item.value)) continue;
    assert.match(item.value, /enterprise/i, `${item.path} recommends Log without an Enterprise caveat`);
  }

  const viDiacritic = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  for (const item of lessonStrings) {
    if (!item.path.endsWith('.en')) continue;
    assert.equal(viDiacritic.test(item.value), false, `${item.path} EN has Vietnamese diacritics: ${item.value.slice(0, 80)}`);
  }

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
