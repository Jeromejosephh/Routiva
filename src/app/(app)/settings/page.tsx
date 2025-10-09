import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import ThemeSettings from "@/components/ThemeSettings";
import SettingsForm from "@/components/SettingsForm";
import DataManagementSection from "@/components/DataManagementSection";

export default async function SettingsPage() {
  const user = await requireUser();
  
  //fetch user settings and account stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userSettings = await (prisma as any).user.findUnique({
    where: { id: user.id },
    select: {
      timezone: true,
      theme: true,
      primaryColor: true,
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
        
        {/* Theme Settings */}
        <div className="border rounded-lg p-6">
          <ThemeSettings />
        </div>

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
      <SettingsForm userSettings={userSettings} />

      {/* Data Management */}
      <DataManagementSection />

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
