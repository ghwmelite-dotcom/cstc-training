import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Default to dark mode for all users
    // Only use stored preference if user has explicitly changed it
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      // If user has explicitly set a preference, use it
      if (stored) return stored;
    }
    // Default to dark mode for the best presentation experience
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Update document class for potential CSS usage
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme configuration object for components
export const themes = {
  dark: {
    // Backgrounds
    bgPrimary: 'bg-slate-900',
    bgSecondary: 'bg-slate-800',
    bgGlass: 'bg-white/10',
    bgGlassHover: 'hover:bg-white/20',
    bgGradient: 'from-slate-900 via-purple-900/50 to-slate-900',

    // Text
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
    textAccent: 'text-cyan-400',

    // Borders
    borderColor: 'border-white/10',
    borderHover: 'hover:border-white/30',

    // Cards
    cardBg: 'bg-white/10 backdrop-blur-xl',
    cardBorder: 'border border-white/20',

    // Gradients
    accentGradient: 'from-cyan-500 via-purple-500 to-pink-500',

    // Shadows
    glowPurple: 'shadow-purple-500/30',
    glowCyan: 'shadow-cyan-500/30',
  },
  light: {
    // Backgrounds
    bgPrimary: 'bg-slate-50',
    bgSecondary: 'bg-white',
    bgGlass: 'bg-white/80',
    bgGlassHover: 'hover:bg-white/90',
    bgGradient: 'from-slate-100 via-blue-50 to-indigo-100',

    // Text
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    textAccent: 'text-cyan-600',

    // Borders
    borderColor: 'border-slate-200',
    borderHover: 'hover:border-slate-400',

    // Cards
    cardBg: 'bg-white/90 backdrop-blur-xl',
    cardBorder: 'border border-slate-200',

    // Gradients
    accentGradient: 'from-cyan-500 via-blue-500 to-indigo-500',

    // Shadows
    glowPurple: 'shadow-indigo-200',
    glowCyan: 'shadow-cyan-200',
  },
};
