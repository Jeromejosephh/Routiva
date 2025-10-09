'use client';

import { useThemeClasses } from "@/components/ThemeProvider";

export default function DataManagementSection() {
  const themeClasses = useThemeClasses();

  return (
    <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-4">Data Management</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Export Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download all your habit data as JSON format.
          </p>
          <button 
            className={`${themeClasses.primary} text-white px-4 py-2 rounded opacity-50 cursor-not-allowed transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]`}
            disabled
            title="Data export will be available in a future update"
          >
            Export Data
          </button>
          <p className="text-xs text-gray-500 mt-1">Feature coming in next release</p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-3">
            Permanently delete your account and all associated data.
          </p>
          <button 
            className="border border-red-300 text-red-600 px-4 py-2 rounded text-sm bg-red-50 cursor-not-allowed transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled
            title="Account deletion will be available in a future update"
          >
            Delete Account
          </button>
          <p className="text-xs text-gray-500 mt-1">Contact support for account deletion requests</p>
        </div>
      </div>
    </div>
  );
}