"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type PastelColor = 'blue' | 'pink' | 'purple' | 'green' | 'orange' | 'yellow' | 'red' | 'teal';

interface ThemeContextType {
  theme: Theme;
  primaryColor: PastelColor;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PastelColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const PASTEL_COLORS = {
  blue: {
    name: 'Ocean Blue',
    light: {
      primary: 'bg-blue-100 border-blue-200 text-blue-900',
      secondary: 'bg-blue-50 border-blue-100 text-blue-800',
      accent: 'bg-blue-500 text-white',
      button: 'bg-blue-400 hover:bg-blue-500 text-white',
      text: 'text-blue-900',
      border: 'border-blue-200',
    },
    dark: {
      primary: 'bg-blue-900/20 border-blue-800/30 text-blue-100',
      secondary: 'bg-blue-800/10 border-blue-700/20 text-blue-200',
      accent: 'bg-blue-600 text-white',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      text: 'text-blue-100',
      border: 'border-blue-800/30',
    }
  },
  pink: {
    name: 'Soft Pink',
    light: {
      primary: 'bg-pink-100 border-pink-200 text-pink-900',
      secondary: 'bg-pink-50 border-pink-100 text-pink-800',
      accent: 'bg-pink-500 text-white',
      button: 'bg-pink-400 hover:bg-pink-500 text-white',
      text: 'text-pink-900',
      border: 'border-pink-200',
    },
    dark: {
      primary: 'bg-pink-900/20 border-pink-800/30 text-pink-100',
      secondary: 'bg-pink-800/10 border-pink-700/20 text-pink-200',
      accent: 'bg-pink-600 text-white',
      button: 'bg-pink-600 hover:bg-pink-700 text-white',
      text: 'text-pink-100',
      border: 'border-pink-800/30',
    }
  },
  purple: {
    name: 'Lavender',
    light: {
      primary: 'bg-purple-100 border-purple-200 text-purple-900',
      secondary: 'bg-purple-50 border-purple-100 text-purple-800',
      accent: 'bg-purple-500 text-white',
      button: 'bg-purple-400 hover:bg-purple-500 text-white',
      text: 'text-purple-900',
      border: 'border-purple-200',
    },
    dark: {
      primary: 'bg-purple-900/20 border-purple-800/30 text-purple-100',
      secondary: 'bg-purple-800/10 border-purple-700/20 text-purple-200',
      accent: 'bg-purple-600 text-white',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      text: 'text-purple-100',
      border: 'border-purple-800/30',
    }
  },
  green: {
    name: 'Mint Green',
    light: {
      primary: 'bg-green-100 border-green-200 text-green-900',
      secondary: 'bg-green-50 border-green-100 text-green-800',
      accent: 'bg-green-500 text-white',
      button: 'bg-green-400 hover:bg-green-500 text-white',
      text: 'text-green-900',
      border: 'border-green-200',
    },
    dark: {
      primary: 'bg-green-900/20 border-green-800/30 text-green-100',
      secondary: 'bg-green-800/10 border-green-700/20 text-green-200',
      accent: 'bg-green-600 text-white',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      text: 'text-green-100',
      border: 'border-green-800/30',
    }
  },
  orange: {
    name: 'Peach',
    light: {
      primary: 'bg-orange-100 border-orange-200 text-orange-900',
      secondary: 'bg-orange-50 border-orange-100 text-orange-800',
      accent: 'bg-orange-500 text-white',
      button: 'bg-orange-400 hover:bg-orange-500 text-white',
      text: 'text-orange-900',
      border: 'border-orange-200',
    },
    dark: {
      primary: 'bg-orange-900/20 border-orange-800/30 text-orange-100',
      secondary: 'bg-orange-800/10 border-orange-700/20 text-orange-200',
      accent: 'bg-orange-600 text-white',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      text: 'text-orange-100',
      border: 'border-orange-800/30',
    }
  },
  yellow: {
    name: 'Sunshine',
    light: {
      primary: 'bg-yellow-100 border-yellow-200 text-yellow-900',
      secondary: 'bg-yellow-50 border-yellow-100 text-yellow-800',
      accent: 'bg-yellow-500 text-white',
      button: 'bg-yellow-400 hover:bg-yellow-500 text-white',
      text: 'text-yellow-900',
      border: 'border-yellow-200',
    },
    dark: {
      primary: 'bg-yellow-900/20 border-yellow-800/30 text-yellow-100',
      secondary: 'bg-yellow-800/10 border-yellow-700/20 text-yellow-200',
      accent: 'bg-yellow-600 text-white',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      text: 'text-yellow-100',
      border: 'border-yellow-800/30',
    }
  },
  red: {
    name: 'Rose',
    light: {
      primary: 'bg-red-100 border-red-200 text-red-900',
      secondary: 'bg-red-50 border-red-100 text-red-800',
      accent: 'bg-red-500 text-white',
      button: 'bg-red-400 hover:bg-red-500 text-white',
      text: 'text-red-900',
      border: 'border-red-200',
    },
    dark: {
      primary: 'bg-red-900/20 border-red-800/30 text-red-100',
      secondary: 'bg-red-800/10 border-red-700/20 text-red-200',
      accent: 'bg-red-600 text-white',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      text: 'text-red-100',
      border: 'border-red-800/30',
    }
  },
  teal: {
    name: 'Aqua',
    light: {
      primary: 'bg-teal-100 border-teal-200 text-teal-900',
      secondary: 'bg-teal-50 border-teal-100 text-teal-800',
      accent: 'bg-teal-500 text-white',
      button: 'bg-teal-400 hover:bg-teal-500 text-white',
      text: 'text-teal-900',
      border: 'border-teal-200',
    },
    dark: {
      primary: 'bg-teal-900/20 border-teal-800/30 text-teal-100',
      secondary: 'bg-teal-800/10 border-teal-700/20 text-teal-200',
      accent: 'bg-teal-600 text-white',
      button: 'bg-teal-600 hover:bg-teal-700 text-white',
      text: 'text-teal-100',
      border: 'border-teal-800/30',
    }
  },
} as const;

export function ThemeProvider({ 
  children,
  initialTheme = 'light',
  initialPrimaryColor = 'blue'
}: { 
  children: React.ReactNode;
  initialTheme?: Theme;
  initialPrimaryColor?: PastelColor;
}) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [primaryColor, setPrimaryColor] = useState<PastelColor>(initialPrimaryColor);
  const [isDark, setIsDark] = useState(false);

  // Ensure component is mounted before applying themes (prevents hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't apply themes until mounted
    
    const applyTheme = () => {
      const root = window.document.documentElement;
      
      // Determine if we should use dark mode
      const shouldUseDark = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      setIsDark(shouldUseDark);
      
      // Remove all theme-related classes first
      root.classList.remove('dark');
      document.body.classList.remove('bg-gray-50', 'bg-gray-900', 'text-gray-900', 'text-gray-100', 'dark');
      
      // Apply theme classes
      if (shouldUseDark) {
        root.classList.add('dark');
        document.body.classList.add('dark', 'bg-gray-900', 'text-gray-100');
      } else {
        document.body.classList.add('bg-gray-50', 'text-gray-900');
      }
      
      // Always add these classes
      document.body.classList.add('min-h-screen', 'transition-colors', 'duration-300');
    };

    // Apply theme immediately
    applyTheme();

    // Listen for system theme changes if using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [mounted, theme, primaryColor]);

  const updateUserPreferences = async (newTheme?: Theme, newColor?: PastelColor) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: newTheme || theme,
          primaryColor: newColor || primaryColor,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    updateUserPreferences(newTheme, undefined);
  };

  const handleSetPrimaryColor = (newColor: PastelColor) => {
    setPrimaryColor(newColor);
    updateUserPreferences(undefined, newColor);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        primaryColor, 
        isDark, 
        setTheme: handleSetTheme, 
        setPrimaryColor: handleSetPrimaryColor 
      }}
    >
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

export function getThemeClasses(primaryColor: PastelColor, isDark: boolean) {
  return PASTEL_COLORS[primaryColor][isDark ? 'dark' : 'light'];
}

// Hook to get current theme classes
export function useThemeClasses() {
  const { primaryColor, isDark } = useTheme();
  return getThemeClasses(primaryColor, isDark);
}