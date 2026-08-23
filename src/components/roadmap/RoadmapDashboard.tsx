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
            <span className="lang-km">បន្តសិក្សា</span>
            <span className="lang-km">Progress overview</span>
            <span className="lang-km">បន្តសិក្សា</span>
        
      </a>
    </section>
  );
}
