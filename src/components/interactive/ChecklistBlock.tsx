import { useEffect, useMemo, useState } from 'react';
import type { ChecklistSection } from '../../data/checklists';

const STORAGE_KEY = 'cfhub_checklist_progress';

type Progress = Record<string, boolean>;

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Progress;
  } catch {
    return {};
  }
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export default function ChecklistBlock({ sections }: { sections: ChecklistSection[] }) {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const done = allItems.filter((i) => progress[i.id]).length;
  const total = allItems.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  function toggle(id: string) {
    setProgress((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveProgress(next);
      return next;
    });
  }

  function reset() {
    setProgress({});
    saveProgress({});
  }

  return (
    <div>
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{pct}%</div>
            <div className="text-muted text-sm">
              {done}/{total}{' '}
              <span className="lang-vi">hoàn thành</span>
              <span className="lang-en">completed</span>
            </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={reset}>
            <span className="lang-vi">Reset</span>
            <span className="lang-en">Reset</span>
          </button>
        </div>
        <div className="cf-progress-track mt-4 h-2 rounded-full">
          <div className="cf-progress-bar h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.id} className="card mb-4">
          <h2 className="text-lg font-semibold">
            <span className="lang-vi">{section.title.vi}</span>
            <span className="lang-en">{section.title.en}</span>
          </h2>
          <ul className="mt-3 space-y-2">
            {section.items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-white/5">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-[var(--cf-border)] accent-[var(--cf-accent)]"
                    checked={Boolean(progress[item.id])}
                    onChange={() => toggle(item.id)}
                  />
                  <span className="text-sm">
                    <span className="lang-vi">{item.text.vi}</span>
                    <span className="lang-en">{item.text.en}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {pct === 100 ? (
        <div className="card border-[var(--cf-accent)]">
          <p className="font-medium">
            <span className="lang-vi">Tuyệt vời! Bạn đã hoàn thành checklist.</span>
            <span className="lang-en">Great! You completed the checklist.</span>
          </p>
          <a className="btn btn-primary mt-4" href="/quiz/beginner-readiness">
            <span className="lang-vi">Kiểm tra kiến thức</span>
            <span className="lang-en">Knowledge check</span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
