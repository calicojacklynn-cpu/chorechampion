'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { themes } from '@/lib/themes';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get all possible theme class names from the imported themes array.
const allThemeClassNames = themes.map(t => t.className);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('theme-default');

  // On initial client-side load, read the theme from localStorage.
  useEffect(() => {
    const storedTheme = localStorage.getItem('chore-champion-theme') || 'theme-default';
    setThemeState(storedTheme);
  }, []);

  // This is the public function for components to call to change the theme.
  // It updates localStorage and our React state.
  const setTheme = useCallback((newTheme: string) => {
    // Check if the theme exists to prevent errors
    if (allThemeClassNames.includes(newTheme)) {
        localStorage.setItem('chore-champion-theme', newTheme);
        setThemeState(newTheme);
    } else {
        console.warn(`Theme "${newTheme}" not found.`);
    }
  }, []);

  // This effect is the SINGLE source of truth for applying the theme class to the DOM.
  // It runs whenever the `theme` state changes.
  useEffect(() => {
    const root = window.document.documentElement;

    // Clean up any old theme classes.
    root.classList.remove(...allThemeClassNames);
    
    // Add the new, current theme class.
    root.classList.add(theme);
    
  }, [theme]); // Only re-run when the theme state changes.

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
