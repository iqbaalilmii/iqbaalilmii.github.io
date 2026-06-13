'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      setTheme(saved);
    }
  }, []);

  const apply = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    if (t === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
  };

  return (
    <span className="theme-toggle" aria-label="select color theme">
      <button
        className={theme === 'light' ? 'active' : ''}
        onClick={() => apply('light')}
        title="light mode"
      >lgt</button>
      <button
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => apply('dark')}
        title="dark mode"
      >drk</button>
      <button
        className={theme === 'auto' ? 'active' : ''}
        onClick={() => apply('auto')}
        title="auto (follow system)"
      >sys</button>
    </span>
  );
}
