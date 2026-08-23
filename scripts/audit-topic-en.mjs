import { readFileSync } from 'node:fs';

const topicEn = readFileSync('src/data/contentRoadmap/topicEn.ts', 'utf8');
const missing = [];

for (let i = 0; i <= 8; i++) {
  const text = readFileSync(`src/data/contentRoadmap/stage${i}.ts`, 'utf8');
  const blocks = [...text.matchAll(/topic\(\s*\n\s*'([^']+)'[\s\S]*?\),/g)];
  for (const m of blocks) {
    const id = m[1];
    const block = m[0];
    const hasMistakeVi = block.includes('commonMistakesVi');
    const hasExerciseVi = block.includes('suggestedExerciseVi');
    const idIdx = topicEn.indexOf(`'${id}'`);
    const slice = idIdx >= 0 ? topicEn.slice(idIdx, idIdx + 1200) : '';
    if (hasMistakeVi && !slice.includes('commonMistakesEn')) missing.push({ id, field: 'commonMistakesEn' });
    if (hasExerciseVi && !slice.includes('suggestedExerciseEn')) missing.push({ id, field: 'suggestedExerciseEn' });
  }
}

console.log(JSON.stringify(missing, null, 2));
