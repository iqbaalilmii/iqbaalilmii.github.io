'use client';

import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M21 13.1A8.5 8.5 0 0 1 10.9 3 7 7 0 1 0 21 13.1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSystem() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem('theme');
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const t = getStoredTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const { label, icon } = useMemo(() => {
    if (theme === 'system') return { label: 'Theme: System', icon: <IconSystem /> };
    if (theme === 'light') return { label: 'Theme: Light', icon: <IconSun /> };
    return { label: 'Theme: Dark', icon: <IconMoon /> };
  }, [theme]);

  function cycle() {
    const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    window.localStorage.setItem('theme', next);
    applyTheme(next);
  }

  return (
    <button type="button" className="navBtn" onClick={cycle} aria-label={label} title={label}>
      {icon}
    </button>
  );
}
