import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cfhub_content_roadmap_progress';

export function loadRoadmapProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveRoadmapProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

type Props = {
  totalTopics: number;
};

export default function RoadmapProgress({ totalTopics }: Props) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const sync = () => {
      const progress = loadRoadmapProgress();
      setDone(Object.values(progress).filter(Boolean).length);
    };
    sync();
    window.addEventListener('cfhub-roadmap-progress', sync);
    return () => window.removeEventListener('cfhub-roadmap-progress', sync);
  }, []);

  const pct = totalTopics ? Math.round((done / totalTopics) * 100) : 0;

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            <span className="lang-vi">Tiến độ học</span>
            <span className="lang-en">Learning progress</span>
          </p>
          <p className="text-muted mt-1 text-xs">
            <span className="lang-vi">
              {done}/{totalTopics} chủ đề · {pct}% — lưu trên trình duyệt
            </span>
            <span className="lang-en">
              {done}/{totalTopics} topics · {pct}% — saved in browser
            </span>
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary text-sm"
          onClick={() => {
            saveRoadmapProgress({});
            document.querySelectorAll<HTMLInputElement>('[data-topic-checkbox]').forEach((el) => {
              el.checked = false;
            });
            window.dispatchEvent(new Event('cfhub-roadmap-progress'));
          }}
        >
          <span className="lang-vi">Reset</span>
          <span className="lang-en">Reset</span>
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--cf-surface-2)]">
        <div className="h-full bg-[var(--cf-accent)] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function bindRoadmapTopicToggles() {
  const progress = loadRoadmapProgress();
  document.querySelectorAll<HTMLInputElement>('[data-topic-checkbox]').forEach((input) => {
    const id = input.dataset.topicCheckbox;
    if (!id) return;
    input.checked = Boolean(progress[id]);
    input.addEventListener('change', () => {
      const next = loadRoadmapProgress();
      next[id] = input.checked;
      saveRoadmapProgress(next);
      window.dispatchEvent(new Event('cfhub-roadmap-progress'));
    });
  });
}
