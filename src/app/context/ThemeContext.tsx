'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = "light" | "dark" | "slate" | "rose" | "ocean" | "sage" | "candy" | "sunset";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('chore-champion-theme') as Theme | null;
    const initialTheme = storedTheme || 'light';
    setThemeState(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('chore-champion-theme', newTheme);
    setThemeState(newTheme);
    document.documentElement.className = newTheme;
  };

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
