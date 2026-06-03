import { useEffect, useMemo, useState } from 'react';
import type { DemoVignette } from '../../data/demoScripts';

function getLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'vi';
}

function t(ls: { vi: string; en: string }, lang: 'vi' | 'en') {
  return lang === 'en' ? ls.en : ls.vi;
}

export default function DemoVignetteList(props: { vignettes: DemoVignette[] }) {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [openId, setOpenId] = useState<string | null>(props.vignettes[0]?.id ?? null);

  useEffect(() => {
    const sync = () => setLang(getLang());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => obs.disconnect();
  }, []);

  const ui = useMemo(
    () =>
      lang === 'en'
        ? {
            when: 'When to open this section',
            dashboard: 'Where in the dashboard',
            steps: 'What to review',
            tips: 'Notes',
            takeaways: 'Key takeaways',
            docs: 'Official docs',
            personas: 'Typical roles',
          }
        : {
            when: 'Khi nào vào mục này',
            dashboard: 'Vị trí trên dashboard',
            steps: 'Nên xem gì',
            tips: 'Lưu ý',
            takeaways: 'Điểm cần nhớ',
            docs: 'Tài liệu chính thức',
            personas: 'Vai trò thường gặp',
          },
    [lang],
  );

  return (
    <div className="space-y-3">
      {props.vignettes.map((v) => {
        const open = openId === v.id;
        return (
          <article key={v.id} className="card overflow-hidden" id={v.id}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 p-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : v.id)}
            >
              <div>
                <h3 className="text-base font-semibold leading-snug">{t(v.title, lang)}</h3>
                <p className="text-muted mt-1 text-sm leading-relaxed">{t(v.opening, lang)}</p>
                <p className="text-muted mt-2 text-xs">
                  <span className="font-medium">{ui.personas}: </span>
                  {v.personas.join(', ')}
                </p>
              </div>
              <span className="text-muted shrink-0 pt-1 text-sm" aria-hidden="true">
                {open ? '▴' : '▾'}
              </span>
            </button>

            {open ? (
              <div className="space-y-4 border-t px-4 pb-4 pt-3" style={{ borderColor: 'var(--cf-border)' }}>
                <p className="text-sm leading-relaxed">
                  <span className="font-medium text-[var(--cf-accent)]">{ui.when}: </span>
                  {t(v.whenToUse, lang)}
                </p>

                {v.dashboardPaths.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cf-text-muted)]">
                      {ui.dashboard}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {v.dashboardPaths.map((path) => (
                        <li key={path} className="badge font-mono text-[0.65rem]">
                          {path}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cf-text-muted)]">{ui.steps}</p>
                  <ol className="mt-2 space-y-3">
                    {v.steps.map((step, i) => (
                      <li key={i} className="text-sm">
                        <p className="font-medium">{t(step.title, lang)}</p>
                        <p className="text-muted mt-0.5 leading-relaxed">{t(step.detail, lang)}</p>
                        {step.dashboardPath ? (
                          <p className="mt-1 font-mono text-xs text-[var(--cf-accent)]">{step.dashboardPath}</p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>

                {v.demoTips.length > 0 ? (
                  <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cf-text-muted)]">{ui.tips}</p>
                    <ul className="text-muted mt-2 list-disc space-y-1 pl-4">
                      {v.demoTips.map((tip, i) => (
                        <li key={i}>{t(tip, lang)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cf-text-muted)]">{ui.takeaways}</p>
                  <ul className="text-muted mt-2 list-disc space-y-1 pl-4 text-sm">
                    {v.keyTakeaways.map((kt, i) => (
                      <li key={i}>{t(kt, lang)}</li>
                    ))}
                  </ul>
                </div>

                {v.docsLinks.length > 0 ? (
                  <p className="text-sm">
                    <span className="font-medium">{ui.docs}: </span>
                    {v.docsLinks.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 ? ' · ' : ''}
                        <a className="link" href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
