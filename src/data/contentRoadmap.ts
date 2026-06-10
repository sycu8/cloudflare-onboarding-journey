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
];

export const contentRoadmapFilters: { id: ContentRoadmapFilter; labelVi: string; labelEn: string }[] = [
  { id: 'foundation', labelVi: 'Nền tảng', labelEn: 'Foundation' },
  { id: 'dns', labelVi: 'DNS', labelEn: 'DNS' },
  { id: 'performance', labelVi: 'Hiệu năng', labelEn: 'Performance' },
  { id: 'security', labelVi: 'Bảo mật', labelEn: 'Security' },
  { id: 'developer', labelVi: 'Developer', labelEn: 'Developer' },
  { id: 'zero-trust', labelVi: 'Zero Trust', labelEn: 'Zero Trust' },
];

export function getStageMinutes(stage: ContentRoadmapStage) {
  return stage.topics.reduce((sum, t) => sum + t.estimatedMinutes, 0);
}

export function getTotalTopicCount() {
  return contentRoadmapStages.reduce((sum, s) => sum + s.topics.length, 0);
}
