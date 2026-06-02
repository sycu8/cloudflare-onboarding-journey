import { useEffect, useState } from 'react';

export function usePageLang(): 'vi' | 'en' {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  useEffect(() => {
    setLang(document.documentElement.dataset.lang === 'en' ? 'en' : 'vi');
  }, []);
  return lang;
}
