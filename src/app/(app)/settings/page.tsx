import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import ThemeSettings from "@/components/ThemeSettings";
import SettingsForm from "@/components/SettingsForm";
import DataManagementSection from "@/components/DataManagementSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routiva | Settings",
  description: "Customize your Routiva experience - manage account preferences, themes, colors, timezone settings, and data export options.",
  openGraph: {
    title: "Routiva | Settings",
    description: "Personalize your habit tracking experience with custom themes, preferences, and account settings.",
  },
};

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
        <div className="border rounded-lg p-6 bg-gray-50 text-black dark:bg-gray-800 dark:text-white">
          <ThemeSettings />
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 text-black dark:bg-gray-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Email:</span>
            <span className="text-black">{userSettings?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Member since:</span>
            <span className="text-black">{userSettings?.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Active habits:</span>
            <span className="text-black">{habitCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Total completions:</span>
            <span className="text-black">{totalLogs}</span>
          </div>
        </div>
      </div>

      {/* user preference form with timezone and notification settings */}
      <SettingsForm userSettings={userSettings} />

      {/* Data Management */}
      <DataManagementSection />

      {/* App Information */}
      <div className="border rounded-lg p-6 bg-gray-50 text-black dark:bg-gray-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">About Routiva</h2>
        <div className="space-y-2 text-sm text-black">
          <p>Version: 0.1.0 (MVP)</p>
          <p>A simple, effective habit tracking application.</p>
          <a
            href="https://jeromejoseph.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            Contact the developer at jeromejoseph.dev
          </a>
          <p className="text-xs text-black mt-1">You can reach out for support, feedback, or questions.</p>
        </div>
      </div>
    </div>
  );
}
