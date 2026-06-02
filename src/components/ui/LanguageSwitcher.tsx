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

  return (
    <button
      type="button"
      className="btn btn-ghost"
      aria-label="Language switcher"
      onClick={() => setLang((l) => (l === 'en' ? 'vi' : 'en'))}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
}
