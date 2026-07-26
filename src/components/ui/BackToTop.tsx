import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 320);
      setLang(document.documentElement.dataset.lang === 'en' ? 'en' : 'vi');
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => {
      window.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  if (!visible) return null;

  const label = lang === 'en' ? 'Back to top' : 'Lên đầu trang';
  return (
    <button
      type="button"
      className="back-to-top fixed bottom-5 right-5 z-40 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cf-accent)]"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m6 14 6-6 6 6M12 18V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
