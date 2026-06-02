import { useEffect, useMemo, useState } from 'react';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight || document.body.scrollHeight;
      const clientHeight = el.clientHeight || window.innerHeight;
      const max = Math.max(1, scrollHeight - clientHeight);
      setProgress(Math.min(1, Math.max(0, scrollTop / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const width = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  return (
    <div className="cf-progress-track fixed left-0 top-16 z-40 h-0.5 w-full">
      <div className="cf-progress-bar h-full transition-[width] duration-150 ease-out" style={{ width }} aria-hidden="true" />
    </div>
  );
}
