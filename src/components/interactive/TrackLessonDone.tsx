import { useEffect, useState } from 'react';
import { TRACK_PROGRESS_EVENT, loadTrackProgress, toggleTrackProgress } from '../../lib/trackProgress';

export default function TrackLessonDone({ itemKey }: { itemKey: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sync = () => setDone(Boolean(loadTrackProgress()[itemKey]));
    sync();
    window.addEventListener(TRACK_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(TRACK_PROGRESS_EVENT, sync);
  }, [itemKey]);

  return (
    <button type="button" className="btn btn-secondary" onClick={() => setDone(Boolean(toggleTrackProgress(itemKey)[itemKey]))}>
      <span className="lang-vi">{done ? 'Đã xong' : 'Đánh dấu đã xong'}</span>
      <span className="lang-en">{done ? 'Done' : 'Mark as done'}</span>
      <span className="lang-km">{done ? 'Done' : 'Mark as done'}</span>
    </button>
  );
}
