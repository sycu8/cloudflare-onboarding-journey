import { useEffect, useState } from 'react';
import { normalizeLanguage } from '../i18n/storage';
import type { Language } from '../i18n/types';

export function usePageLang(): Language {
  const [lang, setLang] = useState<Language>('vi');

  useEffect(() => {
    const read = () => setLang(normalizeLanguage(document.documentElement.dataset.lang));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => observer.disconnect();
  }, []);

  return lang;
}
