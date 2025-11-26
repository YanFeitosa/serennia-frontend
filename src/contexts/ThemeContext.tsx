import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSalonSettings, type SalonTheme, type ThemePalette } from '../lib/api/salon';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  salonTheme: SalonTheme | null;
  refreshSalonTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_LIGHT_PALETTE: ThemePalette = {
  primaryColor: '#25445A',
  secondaryColor: '#7AA7D8',
  accentColor: '#BFA2DB',
  backgroundColor: '#FFFFFF',
  textColor: '#0F1724',
};

const DEFAULT_DARK_PALETTE: ThemePalette = {
  primaryColor: '#4A708A',
  secondaryColor: '#0F1724',
  accentColor: '#BFA2DB',
  backgroundColor: '#0B1220',
  textColor: '#F8FAFC',
};

function applyPaletteToCSS(lightPalette: ThemePalette, darkPalette: ThemePalette) {
  const root = document.documentElement;

  // Light theme colors
  root.style.setProperty('--color-primary-light-theme', lightPalette.primaryColor);
  root.style.setProperty('--color-secondary-light-theme', lightPalette.secondaryColor);
  root.style.setProperty('--color-accent-light-theme', lightPalette.accentColor);
  root.style.setProperty('--color-background-light-theme', lightPalette.backgroundColor);
  root.style.setProperty('--color-text-light-theme', lightPalette.textColor);

  // Dark theme colors
  root.style.setProperty('--color-primary-dark-theme', darkPalette.primaryColor);
  root.style.setProperty('--color-secondary-dark-theme', darkPalette.secondaryColor);
  root.style.setProperty('--color-accent-dark-theme', darkPalette.accentColor);
  root.style.setProperty('--color-background-dark-theme', darkPalette.backgroundColor);
  root.style.setProperty('--color-text-dark-theme', darkPalette.textColor);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });
  const [salonTheme, setSalonTheme] = useState<SalonTheme | null>(null);

  const refreshSalonTheme = useCallback(async () => {
    try {
      const settings = await getSalonSettings();
      if (settings.theme) {
        setSalonTheme(settings.theme);
        const light = { ...DEFAULT_LIGHT_PALETTE, ...settings.theme.light };
        const dark = { ...DEFAULT_DARK_PALETTE, ...settings.theme.dark };
        applyPaletteToCSS(light, dark);
        // Also save to localStorage for faster initial load
        localStorage.setItem('serenna-appearance', JSON.stringify(settings.theme));
      }
    } catch (error) {
      // Silently fail - user might not be authenticated yet
      console.debug('Could not load salon theme:', error);
      // Try to load from localStorage as fallback
      const stored = localStorage.getItem('serenna-appearance');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SalonTheme;
          setSalonTheme(parsed);
          const light = { ...DEFAULT_LIGHT_PALETTE, ...parsed.light };
          const dark = { ...DEFAULT_DARK_PALETTE, ...parsed.dark };
          applyPaletteToCSS(light, dark);
        } catch {
          // Use defaults
          applyPaletteToCSS(DEFAULT_LIGHT_PALETTE, DEFAULT_DARK_PALETTE);
        }
      } else {
        applyPaletteToCSS(DEFAULT_LIGHT_PALETTE, DEFAULT_DARK_PALETTE);
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load salon theme on mount
  useEffect(() => {
    refreshSalonTheme();
  }, [refreshSalonTheme]);

  // Listen for appearance changes from Configuracoes
  useEffect(() => {
    const handleAppearanceChange = () => {
      refreshSalonTheme();
    };
    window.addEventListener('serenna-appearance-changed', handleAppearanceChange);
    return () => {
      window.removeEventListener('serenna-appearance-changed', handleAppearanceChange);
    };
  }, [refreshSalonTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, salonTheme, refreshSalonTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
