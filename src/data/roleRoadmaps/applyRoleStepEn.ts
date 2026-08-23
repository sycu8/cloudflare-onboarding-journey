import type { RoleRoadmapStep } from '../../types/roadmap';
import { roleStepEnById } from './stepEn';
import { roleStepTopicsEnById } from './stepTopicsEn';

export function applyRoleStepEn(step: RoleRoadmapStep): RoleRoadmapStep {
  const en = roleStepEnById[step.id];
  const topicsEn = roleStepTopicsEnById[step.id];
  if (!en && !topicsEn) return step;
  return { ...step, ...en, ...(topicsEn ? { topicsEn } : {}) };
}

export function applyRoleStepsEn(steps: RoleRoadmapStep[]): RoleRoadmapStep[] {
  return steps.map(applyRoleStepEn);
}
