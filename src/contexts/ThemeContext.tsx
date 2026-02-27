import { createContext, useContext, useState, useCallback } from 'react';

const THEME_KEY = 'theme';
type Theme = 'light' | 'dark';

function getThemeFromDom(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function persistTheme(value: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch (_) {
    /* localStorage indisponível (ex.: modo privado) — não quebra */
  }
}

function applyTheme(value: Theme): void {
  const el = document.documentElement;
  if (value === 'light') {
    el.classList.add('light');
  } else {
    el.classList.remove('light');
  }
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getThemeFromDom);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    persistTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'dark' as Theme,
      setTheme: (_: Theme) => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}
