import { useEffect, useMemo, useState } from 'react';

type Localized = { vi: string; en: string };
type Item = { href: string; label: Localized };

function getLang(): 'vi' | 'en' {
  if (typeof window === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function labelFor(item: Item, lang: 'vi' | 'en') {
  return lang === 'en' ? item.label.en : item.label.vi;
}

export default function MobileMenu(props: {
  primary: Item[];
  more: Item[];
}) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      obs.disconnect();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) setMoreOpen(false);
  }, [open]);

  const ui = useMemo(
    () =>
      lang === 'en'
        ? { menu: 'Menu', close: 'Close', more: 'More', pathCta: 'Choose your path' }
        : { menu: 'Menu', close: 'Đóng', more: 'Thêm', pathCta: 'Chọn lộ trình' },
    [lang],
  );

  const linkClass =
    'block rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium leading-snug transition-colors hover:bg-[rgba(255,140,56,0.1)]';

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost min-h-10 min-w-10 px-2.5 md:hidden"
        aria-label={ui.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">{ui.menu}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={ui.menu}>
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={ui.close}
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col shadow-2xl"
            style={{
              borderLeft: '1px solid var(--cf-border)',
              background: 'var(--cf-bg-elevated)',
              color: 'var(--cf-text)',
            }}
          >
            <div
              className="flex h-14 shrink-0 items-center justify-between gap-2 px-3"
              style={{ borderBottom: '1px solid var(--cf-border)' }}
            >
              <span className="truncate text-sm font-semibold">Starter Hub</span>
              <button
                type="button"
                className="btn btn-ghost min-h-9 min-w-9 px-2"
                onClick={() => setOpen(false)}
                aria-label={ui.close}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <a
                href="/choose-your-path"
                className="btn btn-primary mb-3 flex w-full justify-center py-2.5 text-sm"
                onClick={() => setOpen(false)}
              >
                {ui.pathCta}
              </a>

              <nav className="space-y-0.5" aria-label="Mobile navigation">
                {props.primary.map((it) => (
                  <a key={it.href} href={it.href} className={linkClass} onClick={() => setOpen(false)}>
                    {labelFor(it, lang)}
                  </a>
                ))}
              </nav>

              <div className="mt-3" style={{ borderTop: '1px solid var(--cf-border)' }}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--cf-text-muted)]"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                >
                  <span>{ui.more}</span>
                  <span aria-hidden="true" className="text-xs">
                    {moreOpen ? '▴' : '▾'}
                  </span>
                </button>
                {moreOpen ? (
                  <nav className="space-y-0.5 pb-1" aria-label="More links">
                    {props.more.map((it) => (
                      <a
                        key={it.href}
                        href={it.href}
                        className={`${linkClass} text-[var(--cf-text-muted)]`}
                        onClick={() => setOpen(false)}
                      >
                        {labelFor(it, lang)}
                      </a>
                    ))}
                  </nav>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
