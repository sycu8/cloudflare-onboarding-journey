import type { RoleRoadmapStep } from '../../types/roadmap';
import { roleStepKmById } from './stepKm';
import { roleStepTopicsKmById } from './stepTopicsKm';

export function applyRoleStepKm(step: RoleRoadmapStep): RoleRoadmapStep {
  const km = roleStepKmById[step.id];
  const topicsKm = roleStepTopicsKmById[step.id];
  if (!km && !topicsKm) return step;
  return { ...step, ...km, ...(topicsKm ? { topicsKm } : {}) };
}

export function applyRoleStepsKm(steps: RoleRoadmapStep[]): RoleRoadmapStep[] {
  return steps.map(applyRoleStepKm);
}
