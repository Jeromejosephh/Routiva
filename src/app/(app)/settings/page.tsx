import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

//server action to update user preferences
async function updateUserSettings(formData: FormData) {
  "use server";
  
  try {
    const user = await requireUser();
    const timezone = String(formData.get("timezone") ?? "UTC");
    const theme = String(formData.get("theme") ?? "");
    const reminderDailyEnabled = formData.get("reminderDailyEnabled") === "on";
    const reminderDailyTime = String(formData.get("reminderDailyTime") ?? "");
    const summaryWeeklyEnabled = formData.get("summaryWeeklyEnabled") === "on";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        timezone,
        theme: theme || null,
        reminderDailyEnabled,
        reminderDailyTime: reminderDailyTime || null,
        summaryWeeklyEnabled,
      },
    });

    revalidatePath("/settings");
  } catch (error) {
    const { logger } = await import("@/lib/logger");
    logger.error("Failed to update settings", { 
      error: error instanceof Error ? error : new Error(String(error)),
    });
    throw new Error("Failed to update settings. Please try again.");
  }
}



export default async function SettingsPage() {
  const user = await requireUser();
  
  //fetch user settings and account stats
  const userSettings = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      timezone: true,
      theme: true,
      reminderDailyEnabled: true,
      reminderDailyTime: true,
      summaryWeeklyEnabled: true,
      email: true,
      createdAt: true,
    },
  });

  const habitCount = await prisma.habit.count({
    where: { userId: user.id, isArchived: false },
  });

  const totalLogs = await prisma.habitLog.count({
    where: { habit: { userId: user.id } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Settings</h1>
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span>{userSettings?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member since:</span>
            <span>{userSettings?.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active habits:</span>
            <span>{habitCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total completions:</span>
            <span>{totalLogs}</span>
          </div>
        </div>
      </div>

      {/* user preference form with timezone and notification settings */}
      <form action={updateUserSettings} className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={userSettings?.timezone}
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
            </select>
          </div>

          {/* Theme */}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              defaultValue={userSettings?.theme || ""}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Theme switching will be available in a future update</p>
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
            <p className="text-xs text-gray-500 mt-1">Email reminders will be available in a future update</p>
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
            <p className="text-xs text-gray-500 mt-1">Weekly summaries will be available in a future update</p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preferences
        </button>
      </form>

      {/* Data Management */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download all your habit data as JSON format.
            </p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
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
              className="border border-red-300 text-red-600 px-4 py-2 rounded text-sm bg-red-50 cursor-not-allowed"
              disabled
              title="Account deletion will be available in a future update"
            >
              Delete Account
            </button>
            <p className="text-xs text-gray-500 mt-1">Contact support for account deletion requests</p>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">About Routiva</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Version: 0.1.0 (MVP)</p>
          <p>A simple, effective habit tracking application.</p>
        </div>
      </div>
    </div>
  );
}
