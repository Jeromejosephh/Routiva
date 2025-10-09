"use client";


import { useTheme, PASTEL_COLORS, type PastelColor, type Theme } from "./ThemeProvider";
import { Palette, Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSettings() {
  const { theme, primaryColor, isDark, setTheme, setPrimaryColor } = useTheme();

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
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
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

      {/* Preview Section */}
      <div className="border rounded-lg p-4 dark:border-gray-700">
        <h4 className="font-medium mb-3">Preview</h4>
        <div className="space-y-3">
          {/* Sample components using the theme */}
          <div className={`p-3 rounded ${PASTEL_COLORS[primaryColor][isDark ? 'dark' : 'light'].primary}`}>
            <div className="font-medium">Sample Card</div>
            <div className="text-sm opacity-80">This is how your content will look</div>
          </div>
          
          <button className={`px-4 py-2 rounded font-medium ${PASTEL_COLORS[primaryColor][isDark ? 'dark' : 'light'].button}`}>
            Sample Button
          </button>
          
          <div className={`p-2 rounded border ${PASTEL_COLORS[primaryColor][isDark ? 'dark' : 'light'].secondary} ${PASTEL_COLORS[primaryColor][isDark ? 'dark' : 'light'].border}`}>
            <div className="text-sm">Secondary content area</div>
          </div>
        </div>
      </div>

      {/* Color Customization Hint */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Palette className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Pastel Color Theme
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All colors are designed with soft, pleasant pastel tones that work beautifully in both light and dark modes. 
              Your selection will be automatically saved and applied across the entire application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}