import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    
    const timezone = String(formData.get("timezone") ?? "UTC");
    const reminderDailyEnabled = formData.get("reminderDailyEnabled") === "on";
    const reminderDailyTime = String(formData.get("reminderDailyTime") ?? "");
    const summaryWeeklyEnabled = formData.get("summaryWeeklyEnabled") === "on";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        timezone,
        reminderDailyEnabled,
        reminderDailyTime: reminderDailyTime || null,
        summaryWeeklyEnabled,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    const { logger } = await import("@/lib/logger");
    logger.error("Failed to update settings", { 
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}