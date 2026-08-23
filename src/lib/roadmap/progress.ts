import { contentRoadmapStages, getTotalTopicCount } from '../../data/contentRoadmap';
import { roleRoadmaps } from '../../data/roleRoadmaps';
import type { RoleId } from '../../types/roadmap';

const CONTENT_STORAGE_KEY = 'cfhub_content_roadmap_progress';
const ACTIVE_ROLE_KEY = 'cfhub_active_role_roadmap';

export function loadRoadmapProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function saveRoadmapProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function loadRoleProgress(roleId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(`cfhub_role_roadmap_${roleId}`);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function saveRoleProgress(roleId: string, progress: Record<string, boolean>) {
  try {
    localStorage.setItem(`cfhub_role_roadmap_${roleId}`, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export type RoleProgressSummary = {
  roleId: RoleId;
  roleNameVi: string;
  roleNameEn?: string;
  doneWeeks: number;
  totalWeeks: number;
  pct: number;
  nextStepId?: string;
  nextStepHref?: string;
};

export type RoadmapProgressSummary = {
  contentDone: number;
  contentTotal: number;
  contentPct: number;
  nextContentTopicId?: string;
  nextContentHref?: string;
  roles: RoleProgressSummary[];
  activeRoleId?: RoleId;
  activeRole?: RoleProgressSummary;
};

export function getActiveRoleId(): RoleId | undefined {
  try {
    const raw = localStorage.getItem(ACTIVE_ROLE_KEY);
    if (!raw) return undefined;
    return raw as RoleId;
  } catch {
    return undefined;
  }
}

export function setActiveRoleId(roleId: RoleId) {
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, roleId);
    window.dispatchEvent(new Event('cfhub-roadmap-dashboard'));
  } catch {
    /* ignore */
  }
}

export function getRoadmapProgressSummary(): RoadmapProgressSummary {
  const contentProgress = loadRoadmapProgress();
  const contentTotal = getTotalTopicCount();
  const contentDone = Object.values(contentProgress).filter(Boolean).length;
  const contentPct = contentTotal ? Math.round((contentDone / contentTotal) * 100) : 0;

  let nextContentTopicId: string | undefined;
  for (const stage of contentRoadmapStages) {
    for (const topic of stage.topics) {
      if (!contentProgress[topic.id]) {
        nextContentTopicId = topic.id;
        break;
      }
    }
    if (nextContentTopicId) break;
  }

  const roles: RoleProgressSummary[] = roleRoadmaps.map((roadmap) => {
    const progress = loadRoleProgress(roadmap.roleId);
    const doneWeeks = roadmap.steps.filter((step) => progress[step.id]).length;
    const totalWeeks = roadmap.totalWeeks;
    const pct = totalWeeks ? Math.round((doneWeeks / totalWeeks) * 100) : 0;
    const nextStep = roadmap.steps.find((step) => !progress[step.id]);
    return {
      roleId: roadmap.roleId,
      roleNameVi: roadmap.roleNameVi,
      roleNameEn: roadmap.roleNameEn,
      doneWeeks,
      totalWeeks,
      pct,
      nextStepId: nextStep?.id,
      nextStepHref: nextStep ? `/roadmaps/${roadmap.roleId}/#${nextStep.id}` : `/roadmaps/${roadmap.roleId}/`,
    };
  });

  const activeRoleId = getActiveRoleId();
  const activeRole = activeRoleId ? roles.find((r) => r.roleId === activeRoleId) : undefined;

  return {
    contentDone,
    contentTotal,
    contentPct,
    nextContentTopicId,
    nextContentHref: nextContentTopicId ? `/content-roadmap/#${nextContentTopicId}` : '/content-roadmap/',
    roles,
    activeRoleId,
    activeRole,
  };
}

export function exportRoadmapProgressJson(): string {
  const summary = getRoadmapProgressSummary();
  const content = loadRoadmapProgress();
  const roles: Record<string, Record<string, boolean>> = {};
  for (const roadmap of roleRoadmaps) {
    roles[roadmap.roleId] = loadRoleProgress(roadmap.roleId);
  }
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      summary,
      contentProgress: content,
      roleProgress: roles,
      activeRoleId: getActiveRoleId(),
    },
    null,
    2,
  );
}
