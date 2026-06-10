import { useEffect, useState } from 'react';
import type { ContentRoadmapFilter } from '../../types/roadmap';
import { contentRoadmapFilters } from '../../data/contentRoadmap';

type Props = {
  onFilter: (filter: ContentRoadmapFilter | 'all') => void;
};

export default function ContentRoadmapFilters({ onFilter }: Props) {
  const [active, setActive] = useState<ContentRoadmapFilter | 'all'>('all');

  useEffect(() => {
    onFilter(active);
  }, [active, onFilter]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`btn text-sm ${active === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setActive('all')}
      >
        <span className="lang-vi">Tất cả</span>
        <span className="lang-en">All</span>
      </button>
      {contentRoadmapFilters.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`btn text-sm ${active === f.id ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActive(f.id)}
        >
          <span className="lang-vi">{f.labelVi}</span>
          <span className="lang-en">{f.labelEn}</span>
        </button>
      ))}
    </div>
  );
}

export function applyContentRoadmapFilter(filter: ContentRoadmapFilter | 'all') {
  document.querySelectorAll<HTMLElement>('[data-roadmap-stage]').forEach((stage) => {
    const stageTags = (stage.dataset.stageFilters ?? '').split(',');
    const stageMatch = filter === 'all' || stageTags.includes(filter);
    stage.style.display = stageMatch ? '' : 'none';
    stage.querySelectorAll<HTMLElement>('[data-roadmap-topic-card]').forEach((card) => {
      const topicTags = (card.dataset.topicFilters ?? '').split(',');
      const topicMatch = filter === 'all' || topicTags.includes(filter);
      card.style.display = stageMatch && topicMatch ? '' : 'none';
    });
  });
}
