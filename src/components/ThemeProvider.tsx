"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type PastelColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink' | 'teal' | 'indigo' | 'cyan' | 'emerald' | 'lime' | 'amber' | 'rose' | 'violet' | 'sky';
export type WallpaperKey = 'default' | 'mesh' | 'dots' | 'grid';

interface ThemeContextType {
  theme: Theme;
  primaryColor: PastelColor;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PastelColor) => void;
  wallpaperLight: WallpaperKey;
  wallpaperDark: WallpaperKey;
  setWallpaperLight: (key: WallpaperKey) => void;
  setWallpaperDark: (key: WallpaperKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const PASTEL_COLORS = {
  blue: {
    name: 'Blue',
    light: {
      primary: 'bg-blue-400 border-blue-500 text-white',
      secondary: 'bg-blue-300 border-blue-400 text-white',
      accent: 'bg-blue-600 text-white',
      button: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-blue-500',
    },
    dark: {
      primary: 'bg-blue-950 border-blue-900 text-blue-50',
      secondary: 'bg-blue-900 border-blue-800 text-blue-100',
      accent: 'bg-blue-500 text-white',
      button: 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-blue-50',
      border: 'border-blue-900',
    }
  },
  pink: {
    name: 'Pink',
    light: {
      primary: 'bg-pink-400 border-pink-500 text-white',
      secondary: 'bg-pink-300 border-pink-400 text-white',
      accent: 'bg-pink-600 text-white',
      button: 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-pink-500',
    },
    dark: {
      primary: 'bg-pink-950 border-pink-900 text-pink-50',
      secondary: 'bg-pink-900 border-pink-800 text-pink-100',
      accent: 'bg-pink-500 text-white',
      button: 'bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-pink-50',
      border: 'border-pink-900',
    }
  },
  purple: {
    name: 'Purple',
    light: {
      primary: 'bg-purple-400 border-purple-500 text-white',
      secondary: 'bg-purple-300 border-purple-400 text-white',
      accent: 'bg-purple-600 text-white',
      button: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-purple-500',
    },
    dark: {
      primary: 'bg-purple-950 border-purple-900 text-purple-50',
      secondary: 'bg-purple-900 border-purple-800 text-purple-100',
      accent: 'bg-purple-500 text-white',
      button: 'bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-purple-50',
      border: 'border-purple-900',
    }
  },
  green: {
    name: 'Green',
    light: {
      primary: 'bg-green-400 border-green-500 text-white',
      secondary: 'bg-green-300 border-green-400 text-white',
      accent: 'bg-green-600 text-white',
      button: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-green-500',
    },
    dark: {
      primary: 'bg-green-950 border-green-900 text-green-50',
      secondary: 'bg-green-900 border-green-800 text-green-100',
      accent: 'bg-green-500 text-white',
      button: 'bg-green-700 hover:bg-green-800 active:bg-green-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-green-50',
      border: 'border-green-900',
    }
  },
  orange: {
    name: 'Orange',
    light: {
      primary: 'bg-orange-400 border-orange-500 text-white',
      secondary: 'bg-orange-300 border-orange-400 text-white',
      accent: 'bg-orange-600 text-white',
      button: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-orange-500',
    },
    dark: {
      primary: 'bg-orange-950 border-orange-900 text-orange-50',
      secondary: 'bg-orange-900 border-orange-800 text-orange-100',
      accent: 'bg-orange-500 text-white',
      button: 'bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-orange-50',
      border: 'border-orange-900',
    }
  },
  yellow: {
    name: 'Yellow',
    light: {
      primary: 'bg-yellow-400 border-yellow-500 text-white',
      secondary: 'bg-yellow-300 border-yellow-400 text-white',
      accent: 'bg-yellow-600 text-white',
      button: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-yellow-500',
    },
    dark: {
      primary: 'bg-yellow-950 border-yellow-900 text-yellow-50',
      secondary: 'bg-yellow-900 border-yellow-800 text-yellow-100',
      accent: 'bg-yellow-500 text-white',
      button: 'bg-yellow-700 hover:bg-yellow-800 active:bg-yellow-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-yellow-50',
      border: 'border-yellow-900',
    }
  },
  red: {
    name: 'Red',
    light: {
      primary: 'bg-red-400 border-red-500 text-white',
      secondary: 'bg-red-300 border-red-400 text-white',
      accent: 'bg-red-600 text-white',
      button: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-red-500',
    },
    dark: {
      primary: 'bg-red-950 border-red-900 text-red-50',
      secondary: 'bg-red-900 border-red-800 text-red-100',
      accent: 'bg-red-500 text-white',
      button: 'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-red-50',
      border: 'border-red-900',
    }
  },
  teal: {
    name: 'Teal',
    light: {
      primary: 'bg-teal-400 border-teal-500 text-white',
      secondary: 'bg-teal-300 border-teal-400 text-white',
      accent: 'bg-teal-600 text-white',
      button: 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-teal-500',
    },
    dark: {
      primary: 'bg-teal-950 border-teal-900 text-teal-50',
      secondary: 'bg-teal-900 border-teal-800 text-teal-100',
      accent: 'bg-teal-500 text-white',
      button: 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-teal-50',
      border: 'border-teal-900',
    }
  },
  indigo: {
    name: 'Indigo',
    light: {
      primary: 'bg-indigo-400 border-indigo-500 text-white',
      secondary: 'bg-indigo-300 border-indigo-400 text-white',
      accent: 'bg-indigo-600 text-white',
      button: 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-indigo-500',
    },
    dark: {
      primary: 'bg-indigo-950 border-indigo-900 text-indigo-50',
      secondary: 'bg-indigo-900 border-indigo-800 text-indigo-100',
      accent: 'bg-indigo-500 text-white',
      button: 'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-indigo-50',
      border: 'border-indigo-900',
    }
  },
  cyan: {
    name: 'Cyan',
    light: {
      primary: 'bg-cyan-400 border-cyan-500 text-white',
      secondary: 'bg-cyan-300 border-cyan-400 text-white',
      accent: 'bg-cyan-600 text-white',
      button: 'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-cyan-500',
    },
    dark: {
      primary: 'bg-cyan-950 border-cyan-900 text-cyan-50',
      secondary: 'bg-cyan-900 border-cyan-800 text-cyan-100',
      accent: 'bg-cyan-500 text-white',
      button: 'bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-cyan-50',
      border: 'border-cyan-900',
    }
  },
  emerald: {
    name: 'Emerald',
    light: {
      primary: 'bg-emerald-400 border-emerald-500 text-white',
      secondary: 'bg-emerald-300 border-emerald-400 text-white',
      accent: 'bg-emerald-600 text-white',
      button: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-emerald-500',
    },
    dark: {
      primary: 'bg-emerald-950 border-emerald-900 text-emerald-50',
      secondary: 'bg-emerald-900 border-emerald-800 text-emerald-100',
      accent: 'bg-emerald-500 text-white',
      button: 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-emerald-50',
      border: 'border-emerald-900',
    }
  },
  lime: {
    name: 'Lime',
    light: {
      primary: 'bg-lime-400 border-lime-500 text-white',
      secondary: 'bg-lime-300 border-lime-400 text-white',
      accent: 'bg-lime-600 text-white',
      button: 'bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-lime-500',
    },
    dark: {
      primary: 'bg-lime-950 border-lime-900 text-lime-50',
      secondary: 'bg-lime-900 border-lime-800 text-lime-100',
      accent: 'bg-lime-500 text-white',
      button: 'bg-lime-700 hover:bg-lime-800 active:bg-lime-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-lime-50',
      border: 'border-lime-900',
    }
  },
  amber: {
    name: 'Amber',
    light: {
      primary: 'bg-amber-400 border-amber-500 text-white',
      secondary: 'bg-amber-300 border-amber-400 text-white',
      accent: 'bg-amber-600 text-white',
      button: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-amber-500',
    },
    dark: {
      primary: 'bg-amber-950 border-amber-900 text-amber-50',
      secondary: 'bg-amber-900 border-amber-800 text-amber-100',
      accent: 'bg-amber-500 text-white',
      button: 'bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-amber-50',
      border: 'border-amber-900',
    }
  },
  rose: {
    name: 'Rose',
    light: {
      primary: 'bg-rose-400 border-rose-500 text-white',
      secondary: 'bg-rose-300 border-rose-400 text-white',
      accent: 'bg-rose-600 text-white',
      button: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-rose-500',
    },
    dark: {
      primary: 'bg-rose-950 border-rose-900 text-rose-50',
      secondary: 'bg-rose-900 border-rose-800 text-rose-100',
      accent: 'bg-rose-500 text-white',
      button: 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-rose-50',
      border: 'border-rose-900',
    }
  },
  violet: {
    name: 'Violet',
    light: {
      primary: 'bg-violet-400 border-violet-500 text-white',
      secondary: 'bg-violet-300 border-violet-400 text-white',
      accent: 'bg-violet-600 text-white',
      button: 'bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-violet-500',
    },
    dark: {
      primary: 'bg-violet-950 border-violet-900 text-violet-50',
      secondary: 'bg-violet-900 border-violet-800 text-violet-100',
      accent: 'bg-violet-500 text-white',
      button: 'bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-violet-50',
      border: 'border-violet-900',
    }
  },
  sky: {
    name: 'Sky',
    light: {
      primary: 'bg-sky-400 border-sky-500 text-white',
      secondary: 'bg-sky-300 border-sky-400 text-white',
      accent: 'bg-sky-600 text-white',
      button: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-white',
      border: 'border-sky-500',
    },
    dark: {
      primary: 'bg-sky-950 border-sky-900 text-sky-50',
      secondary: 'bg-sky-900 border-sky-800 text-sky-100',
      accent: 'bg-sky-500 text-white',
      button: 'bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]',
      text: 'text-sky-50',
      border: 'border-sky-900',
    }
  },
} as const;

const WALLPAPERS: Record<WallpaperKey, {
  label: string;
  light: { image: string; size?: string };
  dark: { image: string; size?: string };
}> = {
  default: {
    label: 'Default',
    light: { image: "url('/bg_light.png')", size: 'cover' },
    dark: { image: "url('/bg_dark.png')", size: 'cover' },
  },
  mesh: {
    label: 'Mesh',
    light: {
      image:
        'radial-gradient(1200px 600px at 0% 0%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(800px 400px at 100% 100%, rgba(16,185,129,0.15), transparent 60%)',
      size: 'auto',
    },
    dark: {
      image:
        'radial-gradient(1200px 600px at 0% 0%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(800px 400px at 100% 100%, rgba(16,185,129,0.12), transparent 60%)',
      size: 'auto',
    },
  },
  dots: {
    label: 'Dots',
    light: {
      image:
        'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
      size: '12px 12px, 24px 24px',
    },
    dark: {
      image:
        'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
      size: '12px 12px, 24px 24px',
    },
  },
  grid: {
    label: 'Grid',
    light: {
      image:
        'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
      size: '40px 40px',
    },
    dark: {
      image:
        'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
      size: '40px 40px',
    },
  },
};

export function ThemeProvider({ 
  children,
  initialTheme = 'dark',
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
  const [wallpaperLight, setWallpaperLight] = useState<WallpaperKey>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('wallpaperLight') as WallpaperKey) || 'default';
  });
  const [wallpaperDark, setWallpaperDark] = useState<WallpaperKey>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('wallpaperDark') as WallpaperKey) || 'default';
  });

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
      document.body.classList.remove('bg-gray-50', 'bg-gray-900', 'text-gray-900', 'text-gray-100', 'text-white', 'dark');
      
      // Remove existing overlay if any
      const existingOverlay = document.getElementById('bg-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Apply theme classes with consistent positioning
      if (shouldUseDark) {
        root.classList.add('dark');
        document.body.classList.add('dark', 'text-gray-100');
        document.body.style.backgroundColor = '#0f172a';
        const wp = WALLPAPERS[wallpaperDark].dark;
        document.body.style.backgroundImage = wp.image;
        document.body.style.backgroundSize = wp.size || 'cover';
      } else {
        document.body.classList.add('text-gray-900');
        document.body.style.backgroundColor = '#f9fafb';
        const wp = WALLPAPERS[wallpaperLight].light;
        document.body.style.backgroundImage = wp.image;
        document.body.style.backgroundSize = wp.size || 'cover';
      }
      document.body.style.backgroundPosition = 'center center';
      
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
        background-color: ${shouldUseDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
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
  }, [mounted, theme, primaryColor, wallpaperLight, wallpaperDark]);

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

  const handleSetWallpaperLight = (key: WallpaperKey) => {
    setWallpaperLight(key);
    try { localStorage.setItem('wallpaperLight', key); } catch {}
  };

  const handleSetWallpaperDark = (key: WallpaperKey) => {
    setWallpaperDark(key);
    try { localStorage.setItem('wallpaperDark', key); } catch {}
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
        setPrimaryColor: handleSetPrimaryColor,
        wallpaperLight,
        wallpaperDark,
        setWallpaperLight: handleSetWallpaperLight,
        setWallpaperDark: handleSetWallpaperDark,
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

// Expose wallpaper config for previews
export const THEME_WALLPAPERS = WALLPAPERS;

// Hook to get current theme classes
export function useThemeClasses() {
  const { primaryColor, isDark } = useTheme();
  return getThemeClasses(primaryColor, isDark);
}