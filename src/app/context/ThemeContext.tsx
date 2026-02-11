
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { themes } from '@/lib/themes';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const allThemeClassNames = [...themes.map(t => t.className)];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('theme-default');

  useEffect(() => {
    const storedTheme = localStorage.getItem('chore-champion-theme') || 'theme-default';
    setThemeState(storedTheme);
  }, []);

  const setTheme = useCallback((newTheme: string) => {
    const root = window.document.documentElement;
    
    root.classList.remove(...allThemeClassNames);
    root.classList.add(newTheme);

    localStorage.setItem('chore-champion-theme', newTheme);
    setThemeState(newTheme);
  }, []);

  // Apply the theme class to the html element on initial load and theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...allThemeClassNames);
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
