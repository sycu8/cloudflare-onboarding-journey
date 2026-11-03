import { useEffect, useRef, useState } from 'react';
import { applyPageLang } from '../../lib/applyPageLang';
import { getStoredLanguage, languageLabel, setStoredLanguage } from '../../i18n/storage';
import type { Language } from '../../i18n/types';
import LanguagesIcon from './LanguagesIcon';

const LANGUAGE_OPTIONS: Array<{ value: Language; label: string; native: string }> = [
  { value: 'vi', label: 'VI', native: 'Tiếng Việt' },
  { value: 'en', label: 'EN', native: 'English' },
  { value: 'km', label: 'KM', native: 'ខ្មែរ' },
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('vi');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredLanguage();
    setLang(stored);
    applyPageLang(stored);
    const onLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === 'vi' || next === 'en' || next === 'km') setLang(next);
    };
    window.addEventListener('cfhub:language', onLanguage);
    return () => window.removeEventListener('cfhub:language', onLanguage);
  }, []);

  useEffect(() => {
    applyPageLang(lang);
    setStoredLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selectLanguage = (value: Language) => {
    setLang(value);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="lang-switcher-btn btn btn-ghost min-h-10 gap-1.5 px-2.5 sm:px-3"
        aria-label="Choose language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <LanguagesIcon />
        <span className="text-xs font-semibold tracking-wide">{languageLabel(lang)}</span>
      </button>

      {open ? (
        <ul
          role="menu"
          aria-label="Language"
          className="absolute right-0 z-50 mt-1 min-w-[16rem] overflow-hidden rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg-elevated)] py-1 shadow-lg"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={lang === option.value}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--cf-accent)]/10 ${
                  lang === option.value ? 'font-semibold text-[var(--cf-accent)]' : 'text-[var(--cf-text)]'
                }`}
                onClick={() => selectLanguage(option.value)}
              >
                <span>{option.native}</span>
                <span className="text-xs text-[var(--cf-text-muted)]">{option.label}</span>
              </button>
            </li>
          ))}
          <li className="border-t border-[var(--cf-border)] px-3 py-2 text-xs leading-relaxed text-[var(--cf-text-muted)]">
            ខ្លឹមសារភាសាខ្មែរនេះត្រូវបានបកប្រែដោយ AI ហើយអាចមានកំហុស។ យើងណែនាំឱ្យសិក្សាជាភាសាអង់គ្លេស។ / Khmer pages are AI-translated and may contain errors. English is recommended.
          </li>
        </ul>
      ) : null}
    </div>
  );
}
