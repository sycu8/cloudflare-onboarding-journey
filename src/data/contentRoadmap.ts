import type { ContentRoadmapFilter, ContentRoadmapStage } from '../types/roadmap';
import { stage0 } from './contentRoadmap/stage0';
import { stage1 } from './contentRoadmap/stage1';
import { stage2 } from './contentRoadmap/stage2';
import { stage3 } from './contentRoadmap/stage3';
import { stage4 } from './contentRoadmap/stage4';
import { stage5 } from './contentRoadmap/stage5';
import { stage6 } from './contentRoadmap/stage6';
import { stage7 } from './contentRoadmap/stage7';
import { stage8 } from './contentRoadmap/stage8';
import { applyStageTopicEn } from './contentRoadmap/applyTopicEn';
import { applyStageTopicKm } from './contentRoadmap/applyTopicKm';

export const contentRoadmapStages: ContentRoadmapStage[] = [
  stage0,
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  stage6,
  stage7,
  stage8,
].map(applyStageTopicEn).map(applyStageTopicKm);

export const contentRoadmapFilters: { id: ContentRoadmapFilter; labelVi: string; labelEn: string; labelKm?: string }[] = [
  { id: 'foundation', labelVi: 'Nền tảng', labelEn: 'Foundation', labelKm: 'មូលដ្ឋាន' },
  { id: 'dns', labelVi: 'DNS', labelEn: 'DNS', labelKm: 'DNS' },
  { id: 'performance', labelVi: 'Hiệu năng', labelEn: 'Performance', labelKm: 'Performance' },
  { id: 'security', labelVi: 'Bảo mật', labelEn: 'Security', labelKm: 'Security' },
  { id: 'developer', labelVi: 'Developer', labelEn: 'Developer', labelKm: 'Developer' },
  { id: 'zero-trust', labelVi: 'Zero Trust', labelEn: 'Zero Trust', labelKm: 'Zero Trust' },
];

export function getStageMinutes(stage: ContentRoadmapStage) {
  return stage.topics.reduce((sum, t) => sum + t.estimatedMinutes, 0);
}

export function getTotalTopicCount() {
  return contentRoadmapStages.reduce((sum, s) => sum + s.topics.length, 0);
}

export function getContentTopicById(id: string) {
  for (const stage of contentRoadmapStages) {
    const topic = stage.topics.find((t) => t.id === id);
    if (topic) return topic;
  }
  return undefined;
}

export function getContentTopicTitle(id: string, lang: 'vi' | 'en' | 'km' = 'vi') {
  const t = getContentTopicById(id);
  if (!t) return id;
  if (lang === 'km') return t.titleKm ?? t.titleEn ?? t.titleVi;
  if (lang === 'en' && t.titleEn) return t.titleEn;
  return t.titleVi;
}
