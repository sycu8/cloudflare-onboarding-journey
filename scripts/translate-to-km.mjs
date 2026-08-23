/**
 * Generate Khmer translations from English sources.
 *
 * Usage:
 *   node scripts/translate-to-km.mjs --roadmap-topics
 *   node scripts/translate-to-km.mjs --roadmap-steps
 *   node scripts/translate-to-km.mjs --tutorials [--only=/workers/...] [--resume]
 *   node scripts/translate-to-km.mjs --data-glossary
 *
 * Env: TRANSLATE_PROVIDER=google|workers-ai|dry-run
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { translateEnToKm, hasKhmer } from './lib/translate-km.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);

async function translateString(s) {
  if (!s?.trim()) return s;
  return translateEnToKm(s);
}

async function translateStringArray(arr) {
  if (!arr?.length) return arr;
  const out = [];
  for (const item of arr) out.push(await translateString(item));
  return out;
}

function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

async function generateTopicKm() {
  const { topicEnById } = await import('../src/data/contentRoadmap/topicEn.ts');
  const entries = [];
  for (const [id, overlay] of Object.entries(topicEnById)) {
    console.log(`topic ${id}`);
    const km = {};
    if (overlay.summaryEn) km.summaryKm = await translateString(overlay.summaryEn);
    if (overlay.whyItMattersEn) km.whyItMattersKm = await translateString(overlay.whyItMattersEn);
    if (overlay.suggestedExerciseEn) km.suggestedExerciseKm = await translateString(overlay.suggestedExerciseEn);
    if (overlay.commonMistakesEn?.length) {
      km.commonMistakesKm = await translateStringArray(overlay.commonMistakesEn);
    }
    entries.push({ id, km });
  }

  const body = entries
    .map(({ id, km }) => {
      const lines = [`  '${id}': {`];
      if (km.summaryKm) lines.push(`    summaryKm: '${escapeTs(km.summaryKm)}',`);
      if (km.whyItMattersKm) lines.push(`    whyItMattersKm: '${escapeTs(km.whyItMattersKm)}',`);
      if (km.suggestedExerciseKm) lines.push(`    suggestedExerciseKm: '${escapeTs(km.suggestedExerciseKm)}',`);
      if (km.commonMistakesKm?.length) {
        lines.push(`    commonMistakesKm: [${km.commonMistakesKm.map((m) => `'${escapeTs(m)}'`).join(', ')}],`);
      }
      lines.push('  },');
      return lines.join('\n');
    })
    .join('\n');

  const out = `import type { ContentRoadmapTopic } from '../../types/roadmap';

export type TopicKmOverlay = Pick<
  ContentRoadmapTopic,
  'summaryKm' | 'whyItMattersKm' | 'suggestedExerciseKm' | 'commonMistakesKm'
>;

export const topicKmById: Record<string, Partial<TopicKmOverlay>> = {
${body}
};
`;
  writeFileSync(join(root, 'src/data/contentRoadmap/topicKm.ts'), out, 'utf8');
  console.log(`Wrote topicKm.ts (${entries.length} topics)`);
}

async function generateStepKm() {
  const { roleStepEnById } = await import('../src/data/roleRoadmaps/stepEn.ts');
  const { roleStepTopicsEnById } = await import('../src/data/roleRoadmaps/stepTopicsEn.ts');

  const stepEntries = [];
  for (const [id, overlay] of Object.entries(roleStepEnById)) {
    console.log(`step ${id}`);
    stepEntries.push({
      id,
      km: {
        objectiveKm: await translateString(overlay.objectiveEn),
        expectedOutcomeKm: await translateString(overlay.expectedOutcomeEn),
        exercisesKm: await translateStringArray(overlay.exercisesEn),
      },
    });
  }

  const stepBody = stepEntries
    .map(({ id, km }) => {
      return `  '${id}': {
    objectiveKm: '${escapeTs(km.objectiveKm)}',
    expectedOutcomeKm: '${escapeTs(km.expectedOutcomeKm)}',
    exercisesKm: [${km.exercisesKm.map((e) => `'${escapeTs(e)}'`).join(', ')}],
  },`;
    })
    .join('\n');

  writeFileSync(
    join(root, 'src/data/roleRoadmaps/stepKm.ts'),
    `import type { RoleRoadmapStep } from '../../types/roadmap';

export type RoleStepKmOverlay = Pick<
  RoleRoadmapStep,
  'objectiveKm' | 'expectedOutcomeKm' | 'exercisesKm'
>;

export const roleStepKmById: Record<string, RoleStepKmOverlay> = {
${stepBody}
};
`,
    'utf8',
  );

  const topicEntries = [];
  for (const [id, topics] of Object.entries(roleStepTopicsEnById)) {
    console.log(`step topics ${id}`);
    topicEntries.push({ id, topicsKm: await translateStringArray(topics) });
  }

  const topicsBody = topicEntries
    .map(({ id, topicsKm }) => `  '${id}': [${topicsKm.map((t) => `'${escapeTs(t)}'`).join(', ')}],`)
    .join('\n');

  writeFileSync(
    join(root, 'src/data/roleRoadmaps/stepTopicsKm.ts'),
    `export const roleStepTopicsKmById: Record<string, string[]> = {
${topicsBody}
};
`,
    'utf8',
  );

  console.log(`Wrote stepKm.ts (${stepEntries.length}) and stepTopicsKm.ts (${topicEntries.length})`);
}

async function generateTutorialKm() {
  const jsonPath = join(root, 'src/data/tutorialPreviews.data.json');
  const outPath = join(root, 'src/data/tutorialPreviews.km.json');
  const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  let overlay = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};

  const paths = Object.keys(data).filter((p) => !only || p.includes(only));
  let count = 0;

  for (const path of paths) {
    if (overlay[path]?.complete) {
      console.log(`skip (done) ${path}`);
      continue;
    }
    const preview = data[path];
    console.log(`tutorial ${path}`);
    const entry = {
      titleKm: preview.title ? await translateString(preview.title) : undefined,
      summaryKm: preview.summaryEn ? await translateString(preview.summaryEn) : undefined,
      introKm: preview.introEn ? await translateString(preview.introEn) : undefined,
      notesKm: preview.notesEn?.length ? await translateStringArray(preview.notesEn) : undefined,
      sections: {},
    };

    if (preview.sections?.length) {
      for (const section of preview.sections) {
        const sec = {
          titleKm: section.title ? await translateString(section.title) : undefined,
          summaryKm: section.summaryEn ? await translateString(section.summaryEn) : undefined,
          blocks: [],
        };
        for (const block of section.blocks) {
          if (block.type === 'code') {
            sec.blocks.push({ type: 'code', skip: true });
            continue;
          }
          if (block.type === 'paragraph' || block.type === 'note') {
            sec.blocks.push({ type: block.type, htmlKm: await translateString(block.html) });
          } else if (block.type === 'list') {
            sec.blocks.push({
              type: 'list',
              ordered: block.ordered,
              itemsKm: await translateStringArray(block.items),
            });
          }
        }
        entry.sections[section.anchor] = sec;
      }
    }

    entry.complete = true;
    overlay[path] = entry;
    writeFileSync(outPath, `${JSON.stringify(overlay, null, 2)}\n`, 'utf8');
    count++;
    if (count % 5 === 0) console.log(`checkpoint ${Object.keys(overlay).filter((k) => overlay[k].complete).length}/164`);
  }

  writeFileSync(outPath, `${JSON.stringify(overlay, null, 2)}\n`, 'utf8');
  console.log(`Wrote tutorialPreviews.km.json (${paths.length} tutorials)`);
}

async function generateGlossaryKm() {
  const path = join(root, 'src/data/glossary.ts');
  let src = readFileSync(path, 'utf8');
  if (src.includes('km:')) {
    console.log('glossary.ts already has km fields');
    return;
  }

  const enDefRe = /definition:\s*\{\s*vi:\s*'((?:\\'|[^'])*)',\s*en:\s*'((?:\\'|[^'])*)'\s*\}/g;
  let match;
  const replacements = [];
  while ((match = enDefRe.exec(src)) !== null) {
    const en = match[2].replace(/\\'/g, "'");
    const km = await translateString(en);
    replacements.push({ full: match[0], vi: match[1], en: match[2], km: escapeTs(km) });
  }

  for (const r of replacements.reverse()) {
    const next = `definition: { vi: '${r.vi}', en: '${r.en}', km: '${r.km}' }`;
    src = src.replace(r.full, next);
  }

  writeFileSync(path, src, 'utf8');
  console.log(`Updated glossary.ts (${replacements.length} terms)`);
}

async function main() {
  if (flags.has('--roadmap-topics')) return generateTopicKm();
  if (flags.has('--roadmap-steps')) return generateStepKm();
  if (flags.has('--tutorials')) return generateTutorialKm();
  if (flags.has('--data-glossary')) return generateGlossaryKm();
  console.log('Specify --roadmap-topics, --roadmap-steps, --tutorials, or --data-glossary');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
