'use client';

import { useRouter } from 'next/navigation';
import { useThemeClasses } from "@/components/ThemeProvider";

interface SettingsFormProps {
  userSettings: {
    timezone: string | null;
  } | null;
}

export default function SettingsForm({ userSettings }: SettingsFormProps) {
  const themeClasses = useThemeClasses();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  }

  return (
    <form action={handleSubmit} className="border rounded-lg p-6 backdrop-blur-sm bg-gray-200 dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={userSettings?.timezone || "UTC"}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
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
