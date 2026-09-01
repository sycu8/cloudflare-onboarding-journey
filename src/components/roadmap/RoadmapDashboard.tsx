import { useCallback, useEffect, useState } from 'react';
import {
  exportRoadmapProgressJson,
  getRoadmapProgressSummary,
  setActiveRoleId,
  type RoadmapProgressSummary,
} from '../../lib/roadmap/progress';

export default function RoadmapDashboard() {
  const [summary, setSummary] = useState<RoadmapProgressSummary | null>(null);

  const sync = useCallback(() => {
    setSummary(getRoadmapProgressSummary());
  }, []);

  useEffect(() => {
    sync();
    const events = ['cfhub-roadmap-progress', 'cfhub-role-roadmap-progress', 'cfhub-roadmap-dashboard'];
    for (const event of events) {
      window.addEventListener(event, sync);
    }
    return () => {
      for (const event of events) {
        window.removeEventListener(event, sync);
      }
    };
  }, [sync]);

  if (!summary) return null;

  const continueHref =
    summary.activeRole?.nextStepHref ??
    summary.nextContentHref ??
    '/content-roadmap/';

  return (
    <section className="card space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            <span className="lang-vi">Tổng quan tiến độ</span>
            <span className="lang-en">Progress overview</span>
            <span className="lang-km">Progress overview</span>
          </h2>
          <p className="text-muted mt-1 text-sm">
            <span className="lang-vi">
              Content roadmap {summary.contentDone}/{summary.contentTotal} · {summary.contentPct}%
            </span>
            <span className="lang-en">
              Content roadmap {summary.contentDone}/{summary.contentTotal} · {summary.contentPct}%
            </span>
            <span className="lang-km">
              Content roadmap {summary.contentDone}/{summary.contentTotal} · {summary.contentPct}%
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn btn-primary" href={continueHref}>
            <span className="lang-vi">Tiếp tục</span>
            <span className="lang-en">Continue</span>
            <span className="lang-km">Continue</span>
          </a>
          <button
            type="button"
            className="btn btn-secondary text-sm"
            onClick={() => {
              const blob = new Blob([exportRoadmapProgressJson()], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cfhub-roadmap-progress.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            JSON
          </button>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--cf-surface-2)]">
        <div
          className="h-full bg-[var(--cf-accent)] transition-all"
          style={{ width: `${summary.contentPct}%` }}
        />
      </div>

      {summary.roles.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {summary.roles.map((role) => (
            <li key={role.roleId}>
              <button
                type="button"
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                  summary.activeRoleId === role.roleId
                    ? 'border-[var(--cf-accent)] bg-[var(--cf-accent)]/10'
                    : 'border-[var(--cf-border)]'
                }`}
                onClick={() => {
                  setActiveRoleId(role.roleId);
                  sync();
                }}
              >
                <span className="font-medium">
                  <span className="lang-vi">{role.roleNameVi}</span>
                  <span className="lang-en">{role.roleNameEn ?? role.roleNameVi}</span>
                  <span className="lang-km">{role.roleNameEn ?? role.roleNameVi}</span>
                </span>
                <span className="text-muted mt-0.5 block text-xs">
                  {role.doneWeeks}/{role.totalWeeks} · {role.pct}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
