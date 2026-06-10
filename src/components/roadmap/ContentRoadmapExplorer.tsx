import { useCallback } from 'react';
import type { ContentRoadmapFilter } from '../../types/roadmap';
import ContentRoadmapFilters, { applyContentRoadmapFilter } from './ContentRoadmapFilters';

export default function ContentRoadmapExplorer() {
  const onFilter = useCallback((filter: ContentRoadmapFilter | 'all') => {
    applyContentRoadmapFilter(filter);
  }, []);

  return <ContentRoadmapFilters onFilter={onFilter} />;
}
