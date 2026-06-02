import { useEffect, useMemo, useState } from 'react';
import { applyPageLang } from '../../lib/applyPageLang';
import { getStoredLanguage, setStoredLanguage } from '../../i18n/storage';
import type { Language } from '../../i18n/types';

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

  const label = useMemo(() => {
    return lang === 'en' ? 'Tiếng Việt' : 'English only';
  }, [lang]);

  const short = lang === 'en' ? 'VI' : 'EN';

  return (
    <button
      type="button"
      className="btn btn-ghost min-h-10 min-w-10 px-2 sm:min-w-0 sm:px-3"
      aria-label={label}
      onClick={() => setLang((l) => (l === 'en' ? 'vi' : 'en'))}
    >
      <span className="text-xs font-semibold tracking-wide sm:hidden">{short}</span>
      <span className="hidden text-sm sm:inline">{label}</span>
    </button>
  );
}
