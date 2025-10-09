"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type PastelColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink' | 'teal' | 'indigo' | 'cyan' | 'emerald' | 'lime' | 'amber' | 'rose' | 'violet' | 'sky';

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
    name: 'Blue',
    light: {
      primary: 'bg-blue-100 border-blue-200 text-blue-900',
      secondary: 'bg-blue-50 border-blue-100 text-blue-800',
      accent: 'bg-blue-500 text-white',
      button: 'bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-blue-900',
      border: 'border-blue-200',
    },
    dark: {
      primary: 'bg-blue-900 border-blue-800 text-blue-100',
      secondary: 'bg-blue-800 border-blue-700 text-blue-200',
      accent: 'bg-blue-600 text-white',
      button: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-blue-100',
      border: 'border-blue-800',
    }
  },
  pink: {
    name: 'Pink',
    light: {
      primary: 'bg-pink-100 border-pink-200 text-pink-900',
      secondary: 'bg-pink-50 border-pink-100 text-pink-800',
      accent: 'bg-pink-500 text-white',
      button: 'bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-pink-900',
      border: 'border-pink-200',
    },
    dark: {
      primary: 'bg-pink-900 border-pink-800 text-pink-100',
      secondary: 'bg-pink-800 border-pink-700 text-pink-200',
      accent: 'bg-pink-600 text-white',
      button: 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-pink-100',
      border: 'border-pink-800',
    }
  },
  purple: {
    name: 'Purple',
    light: {
      primary: 'bg-purple-100 border-purple-200 text-purple-900',
      secondary: 'bg-purple-50 border-purple-100 text-purple-800',
      accent: 'bg-purple-500 text-white',
      button: 'bg-purple-400 hover:bg-purple-500 active:bg-purple-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-purple-900',
      border: 'border-purple-200',
    },
    dark: {
      primary: 'bg-purple-900 border-purple-800 text-purple-100',
      secondary: 'bg-purple-800 border-purple-700 text-purple-200',
      accent: 'bg-purple-600 text-white',
      button: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-purple-100',
      border: 'border-purple-800',
    }
  },
  green: {
    name: 'Green',
    light: {
      primary: 'bg-green-100 border-green-200 text-green-900',
      secondary: 'bg-green-50 border-green-100 text-green-800',
      accent: 'bg-green-500 text-white',
      button: 'bg-green-400 hover:bg-green-500 active:bg-green-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-green-900',
      border: 'border-green-200',
    },
    dark: {
      primary: 'bg-green-900 border-green-800 text-green-100',
      secondary: 'bg-green-800 border-green-700 text-green-200',
      accent: 'bg-green-600 text-white',
      button: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-green-100',
      border: 'border-green-800',
    }
  },
  orange: {
    name: 'Orange',
    light: {
      primary: 'bg-orange-100 border-orange-200 text-orange-900',
      secondary: 'bg-orange-50 border-orange-100 text-orange-800',
      accent: 'bg-orange-500 text-white',
      button: 'bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-orange-900',
      border: 'border-orange-200',
    },
    dark: {
      primary: 'bg-orange-900 border-orange-800 text-orange-100',
      secondary: 'bg-orange-800 border-orange-700 text-orange-200',
      accent: 'bg-orange-600 text-white',
      button: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-orange-100',
      border: 'border-orange-800',
    }
  },
  yellow: {
    name: 'Yellow',
    light: {
      primary: 'bg-yellow-100 border-yellow-200 text-yellow-900',
      secondary: 'bg-yellow-50 border-yellow-100 text-yellow-800',
      accent: 'bg-yellow-500 text-white',
      button: 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-yellow-900',
      border: 'border-yellow-200',
    },
    dark: {
      primary: 'bg-yellow-900 border-yellow-800 text-yellow-100',
      secondary: 'bg-yellow-800 border-yellow-700 text-yellow-200',
      accent: 'bg-yellow-600 text-white',
      button: 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-yellow-100',
      border: 'border-yellow-800',
    }
  },
  red: {
    name: 'Red',
    light: {
      primary: 'bg-red-100 border-red-200 text-red-900',
      secondary: 'bg-red-50 border-red-100 text-red-800',
      accent: 'bg-red-500 text-white',
      button: 'bg-red-400 hover:bg-red-500 active:bg-red-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-red-900',
      border: 'border-red-200',
    },
    dark: {
      primary: 'bg-red-900 border-red-800 text-red-100',
      secondary: 'bg-red-800 border-red-700 text-red-200',
      accent: 'bg-red-600 text-white',
      button: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-red-100',
      border: 'border-red-800',
    }
  },
  teal: {
    name: 'Teal',
    light: {
      primary: 'bg-teal-100 border-teal-200 text-teal-900',
      secondary: 'bg-teal-50 border-teal-100 text-teal-800',
      accent: 'bg-teal-500 text-white',
      button: 'bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-teal-900',
      border: 'border-teal-200',
    },
    dark: {
      primary: 'bg-teal-900 border-teal-800 text-teal-100',
      secondary: 'bg-teal-800 border-teal-700 text-teal-200',
      accent: 'bg-teal-600 text-white',
      button: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-teal-100',
      border: 'border-teal-800',
    }
  },
  indigo: {
    name: 'Indigo',
    light: {
      primary: 'bg-indigo-100 border-indigo-200 text-indigo-900',
      secondary: 'bg-indigo-50 border-indigo-100 text-indigo-800',
      accent: 'bg-indigo-500 text-white',
      button: 'bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
    },
    dark: {
      primary: 'bg-indigo-900 border-indigo-800 text-indigo-100',
      secondary: 'bg-indigo-800 border-indigo-700 text-indigo-200',
      accent: 'bg-indigo-600 text-white',
      button: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-indigo-100',
      border: 'border-indigo-800',
    }
  },
  cyan: {
    name: 'Cyan',
    light: {
      primary: 'bg-cyan-100 border-cyan-200 text-cyan-900',
      secondary: 'bg-cyan-50 border-cyan-100 text-cyan-800',
      accent: 'bg-cyan-500 text-white',
      button: 'bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-cyan-900',
      border: 'border-cyan-200',
    },
    dark: {
      primary: 'bg-cyan-900 border-cyan-800 text-cyan-100',
      secondary: 'bg-cyan-800 border-cyan-700 text-cyan-200',
      accent: 'bg-cyan-600 text-white',
      button: 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-cyan-100',
      border: 'border-cyan-800',
    }
  },
  emerald: {
    name: 'Emerald',
    light: {
      primary: 'bg-emerald-100 border-emerald-200 text-emerald-900',
      secondary: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      accent: 'bg-emerald-500 text-white',
      button: 'bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
    },
    dark: {
      primary: 'bg-emerald-900 border-emerald-800 text-emerald-100',
      secondary: 'bg-emerald-800 border-emerald-700 text-emerald-200',
      accent: 'bg-emerald-600 text-white',
      button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-emerald-100',
      border: 'border-emerald-800',
    }
  },
  lime: {
    name: 'Lime',
    light: {
      primary: 'bg-lime-100 border-lime-200 text-lime-900',
      secondary: 'bg-lime-50 border-lime-100 text-lime-800',
      accent: 'bg-lime-500 text-white',
      button: 'bg-lime-400 hover:bg-lime-500 active:bg-lime-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-lime-900',
      border: 'border-lime-200',
    },
    dark: {
      primary: 'bg-lime-900 border-lime-800 text-lime-100',
      secondary: 'bg-lime-800 border-lime-700 text-lime-200',
      accent: 'bg-lime-600 text-white',
      button: 'bg-lime-600 hover:bg-lime-700 active:bg-lime-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-lime-100',
      border: 'border-lime-800',
    }
  },
  amber: {
    name: 'Amber',
    light: {
      primary: 'bg-amber-100 border-amber-200 text-amber-900',
      secondary: 'bg-amber-50 border-amber-100 text-amber-800',
      accent: 'bg-amber-500 text-white',
      button: 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-amber-900',
      border: 'border-amber-200',
    },
    dark: {
      primary: 'bg-amber-900 border-amber-800 text-amber-100',
      secondary: 'bg-amber-800 border-amber-700 text-amber-200',
      accent: 'bg-amber-600 text-white',
      button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-amber-100',
      border: 'border-amber-800',
    }
  },
  rose: {
    name: 'Rose',
    light: {
      primary: 'bg-rose-100 border-rose-200 text-rose-900',
      secondary: 'bg-rose-50 border-rose-100 text-rose-800',
      accent: 'bg-rose-500 text-white',
      button: 'bg-rose-400 hover:bg-rose-500 active:bg-rose-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-rose-900',
      border: 'border-rose-200',
    },
    dark: {
      primary: 'bg-rose-900 border-rose-800 text-rose-100',
      secondary: 'bg-rose-800 border-rose-700 text-rose-200',
      accent: 'bg-rose-600 text-white',
      button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-rose-100',
      border: 'border-rose-800',
    }
  },
  violet: {
    name: 'Violet',
    light: {
      primary: 'bg-violet-100 border-violet-200 text-violet-900',
      secondary: 'bg-violet-50 border-violet-100 text-violet-800',
      accent: 'bg-violet-500 text-white',
      button: 'bg-violet-400 hover:bg-violet-500 active:bg-violet-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-violet-900',
      border: 'border-violet-200',
    },
    dark: {
      primary: 'bg-violet-900 border-violet-800 text-violet-100',
      secondary: 'bg-violet-800 border-violet-700 text-violet-200',
      accent: 'bg-violet-600 text-white',
      button: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-violet-100',
      border: 'border-violet-800',
    }
  },
  sky: {
    name: 'Sky',
    light: {
      primary: 'bg-sky-100 border-sky-200 text-sky-900',
      secondary: 'bg-sky-50 border-sky-100 text-sky-800',
      accent: 'bg-sky-500 text-white',
      button: 'bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-sky-900',
      border: 'border-sky-200',
    },
    dark: {
      primary: 'bg-sky-900 border-sky-800 text-sky-100',
      secondary: 'bg-sky-800 border-sky-700 text-sky-200',
      accent: 'bg-sky-600 text-white',
      button: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-sky-100',
      border: 'border-sky-800',
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
      
      // Remove existing overlay if any
      const existingOverlay = document.getElementById('bg-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Apply theme classes with consistent positioning
      if (shouldUseDark) {
        root.classList.add('dark');
        document.body.classList.add('dark', 'text-gray-100');
        document.body.style.backgroundImage = "url('/bg-dark.png')";
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundSize = 'cover';
      } else {
        document.body.classList.add('text-gray-900');
        document.body.style.backgroundImage = "url('/bg-light.png')";
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundSize = 'cover';
      }
      
      // Always add these classes and background styles
      document.body.classList.add('min-h-screen', 'transition-all', 'duration-300');
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      
      // Add overlay for 20% transparency
      const overlay = document.getElementById('bg-overlay') || document.createElement('div');
      overlay.id = 'bg-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${shouldUseDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
        pointer-events: none;
        z-index: -1;
      `;
      if (!document.getElementById('bg-overlay')) {
        document.body.appendChild(overlay);
      }
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