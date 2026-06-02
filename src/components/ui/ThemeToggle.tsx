import { useEffect, useState } from 'react';

const THEME_KEY = 'cfhub_theme';
type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="btn btn-ghost min-w-[2.75rem] px-3"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span className="hidden text-sm sm:inline">
        <span className="lang-vi">{isDark ? 'Sáng' : 'Tối'}</span>
        <span className="lang-en">{isDark ? 'Light' : 'Dark'}</span>
      </span>
    </button>
  );
}
