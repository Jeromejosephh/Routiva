'use client';

import { useThemeClasses } from "@/components/ThemeProvider";

interface SettingsFormProps {
  userSettings: {
    timezone: string | null;
    reminderDailyEnabled: boolean;
    reminderDailyTime: string | null;
    summaryWeeklyEnabled: boolean;
  } | null;
}

export default function SettingsForm({ userSettings }: SettingsFormProps) {
  const themeClasses = useThemeClasses();

  async function handleSubmit(formData: FormData) {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      // Show success message or refresh
      window.location.reload();
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  }

  return (
    <form action={handleSubmit} className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-1">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={userSettings?.timezone || "UTC"}
            className="w-full border rounded px-3 py-2"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Shanghai">Shanghai</option>
            <option value="Australia/Sydney">Sydney</option>
            <option value="Pacific/Auckland">New Zealand</option>
          </select>
        </div>

        {/* Daily Reminders */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="reminderDailyEnabled"
              name="reminderDailyEnabled"
              defaultChecked={userSettings?.reminderDailyEnabled}
              className="rounded"
            />
            <label htmlFor="reminderDailyEnabled" className="text-sm font-medium">
              Enable daily reminders
            </label>
          </div>
          
          <input
            type="time"
            id="reminderDailyTime"
            name="reminderDailyTime"
            defaultValue={userSettings?.reminderDailyTime || "09:00"}
            className="border rounded px-3 py-2"
          />
          <p className="text-xs text-white/60 mt-1">Email reminders will be available in a future update</p>
        </div>

        {/* Weekly Summary */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="summaryWeeklyEnabled"
              name="summaryWeeklyEnabled"
              defaultChecked={userSettings?.summaryWeeklyEnabled}
              className="rounded"
            />
            <label htmlFor="summaryWeeklyEnabled" className="text-sm font-medium">
              Enable weekly summary emails
            </label>
          </div>
          <p className="text-xs text-white/60 mt-1">Weekly summaries will be available in a future update</p>
        </div>
      </div>

      <button
        type="submit"
        className={`mt-6 ${themeClasses.button} text-white px-4 py-2 rounded`}
      >
        Save Preferences
      </button>
    </form>
  );
}