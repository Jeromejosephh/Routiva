"use client";


import { useTheme, PASTEL_COLORS, getThemeClasses, type PastelColor, type Theme } from "./ThemeProvider";
import { Palette, Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSettings() {
  const { theme, primaryColor, isDark, setTheme, setPrimaryColor } = useTheme();
  const themeClasses = getThemeClasses(primaryColor, isDark);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Monitor size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette size={20} />
          Appearance Settings
        </h3>
        
        <div className="space-y-4">
          {/* Theme Mode */}
          <div>
            <label className="block text-sm font-medium mb-3">Theme Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    theme === option.value
                      ? `${themeClasses.primary} ${themeClasses.border}`
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Primary Color</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(PASTEL_COLORS).map(([colorKey, colorConfig]) => {
                const isSelected = primaryColor === colorKey;
                const colorClasses = colorConfig[isDark ? 'dark' : 'light'];
                
                return (
                  <button
                    key={colorKey}
                    onClick={() => setPrimaryColor(colorKey as PastelColor)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-gray-400 dark:border-gray-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full ${colorClasses.accent} ${
                        isSelected ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
                      }`}
                    />
                    <span className="text-xs font-medium text-center">
                      {colorConfig.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border rounded-lg p-4 dark:border-gray-700 backdrop-blur-sm bg-white/60 dark:bg-gray-700/60">
        <h4 className="font-medium mb-3">Preview</h4>
        <div className="space-y-3">
          <div className={`p-3 rounded ${themeClasses.primary}`}>
            <div className="font-medium">Sample Card</div>
            <div className="text-sm opacity-80">This is how your content will look</div>
          </div>
          <button className={`px-4 py-2 rounded font-medium ${themeClasses.button}`}>
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}