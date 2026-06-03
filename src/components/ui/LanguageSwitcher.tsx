import { useEffect, useMemo, useState } from 'react';
import { applyPageLang } from '../../lib/applyPageLang';
import { getStoredLanguage, setStoredLanguage } from '../../i18n/storage';
import type { Language } from '../../i18n/types';
import LanguagesIcon from './LanguagesIcon';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('vi');

  useEffect(() => {
    const stored = getStoredLanguage();
    setLang(stored);
    applyPageLang(stored);
  }, []);

  useEffect(() => {
    applyPageLang(lang);
    setStoredLanguage(lang);
  }, [lang]);

  const { ariaLabel, targetLabel } = useMemo(() => {
    if (lang === 'en') {
      return {
        ariaLabel: 'Switch to Vietnamese',
        targetLabel: 'VI',
      };
    }
    return {
      ariaLabel: 'Switch to English',
      targetLabel: 'EN',
    };
  }, [lang]);

  return (
    <button
      type="button"
      className="lang-switcher-btn btn btn-ghost min-h-10 gap-1.5 px-2.5 sm:px-3"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={() => setLang((l) => (l === 'en' ? 'vi' : 'en'))}
    >
      <LanguagesIcon />
      <span className="text-xs font-semibold tracking-wide">{targetLabel}</span>
    </button>
  );
}
