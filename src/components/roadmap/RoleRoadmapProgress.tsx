import { useEffect, useState } from 'react';

const storageKey = (roleId: string) => `cfhub_role_roadmap_${roleId}`;

export function loadRoleProgress(roleId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey(roleId));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveRoleProgress(roleId: string, progress: Record<string, boolean>) {
  try {
    localStorage.setItem(storageKey(roleId), JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

type Props = {
  roleId: string;
  totalWeeks: number;
};

export default function RoleRoadmapProgress({ roleId, totalWeeks }: Props) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const sync = () => {
      const progress = loadRoleProgress(roleId);
      setDone(Object.values(progress).filter(Boolean).length);
    };
    sync();
    window.addEventListener('cfhub-role-roadmap-progress', sync);
    return () => window.removeEventListener('cfhub-role-roadmap-progress', sync);
  }, [roleId]);

  const pct = totalWeeks ? Math.round((done / totalWeeks) * 100) : 0;

  return (
    <div className="card">
      <p className="text-sm font-semibold">
        <span className="lang-vi">Tiến độ roadmap</span>
        <span className="lang-en">Roadmap progress</span>
      </p>
      <p className="text-muted mt-1 text-xs">
        <span className="lang-vi">
          {done}/{totalWeeks} tuần · {pct}%
        </span>
        <span className="lang-en">
          {done}/{totalWeeks} weeks · {pct}%
        </span>
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--cf-surface-2)]">
        <div className="h-full bg-[var(--cf-accent)] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function bindRoleWeekToggles(roleId: string) {
  const progress = loadRoleProgress(roleId);
  document.querySelectorAll<HTMLInputElement>('[data-week-checkbox]').forEach((input) => {
    const id = input.dataset.weekCheckbox;
    if (!id) return;
    input.checked = Boolean(progress[id]);
    input.addEventListener('change', () => {
      const next = loadRoleProgress(roleId);
      next[id] = input.checked;
      saveRoleProgress(roleId, next);
      window.dispatchEvent(new Event('cfhub-role-roadmap-progress'));
    });
  });
}

export function startRoleRoadmap(roleId: string, firstStepId: string) {
  const next = loadRoleProgress(roleId);
  next[firstStepId] = true;
  saveRoleProgress(roleId, next);
  const checkbox = document.querySelector<HTMLInputElement>(`[data-week-checkbox="${firstStepId}"]`);
  if (checkbox) checkbox.checked = true;
  window.dispatchEvent(new Event('cfhub-role-roadmap-progress'));
  document.getElementById(firstStepId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
