import { useEffect, useMemo, useState } from 'react';

type Localized = { vi: string; en: string };
type Item = { href: string; label: Localized };

function getLang(): 'vi' | 'en' {
  if (typeof window === 'undefined') return 'vi';
  const l = document.documentElement.dataset.lang;
  return l === 'en' ? 'en' : 'vi';
}

export default function MobileMenu(props: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    setLang(getLang());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const ui = useMemo(() => {
    return lang === 'en'
      ? { menu: 'Menu', close: 'Close' }
      : { menu: 'Menu', close: 'Đóng' };
  }, [lang]);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary lg:hidden"
        aria-label={ui.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">☰</span>
        <span className="text-sm">{ui.menu}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={ui.menu}>
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Backdrop"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 top-0 flex h-full w-[min(92vw,400px)] flex-col border-l p-4 shadow-2xl"
            style={{
              borderColor: 'var(--cf-border)',
              background: 'var(--cf-bg-elevated)',
              color: 'var(--cf-text)',
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--cf-border)' }}>
              <div className="text-sm font-semibold">Cloudflare Starter Hub</div>
              <button type="button" className="btn btn-ghost px-3" onClick={() => setOpen(false)} aria-label={ui.close}>
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <nav className="mt-3 flex-1 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
              {props.items.map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium transition-colors"
                  style={{ color: 'var(--cf-text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 140, 56, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => setOpen(false)}
                >
                  <span className="lang-vi">{it.label.vi}</span>
                  <span className="lang-en">{it.label.en}</span>
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                </a>
              ))}
            </nav>

            <div
              className="text-muted mt-3 rounded-xl border p-3 text-xs"
              style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}
            >
              <span className="lang-vi">Mẹo: bật chế độ Tối/Sáng hoặc English only ở thanh trên.</span>
              <span className="lang-en">Tip: toggle Dark/Light or English only in the top bar.</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
