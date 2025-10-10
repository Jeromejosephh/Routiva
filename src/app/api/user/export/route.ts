// src/app/api/user/export/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUser();

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        timezone: true,
        theme: true,
        primaryColor: true,
        reminderDailyEnabled: true,
        reminderDailyTime: true,
        summaryWeeklyEnabled: true,
      }
    });

    // Fetch all habits with their logs
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        logs: {
          orderBy: { date: 'desc' }
        },
        group: {
          select: {
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    // Fetch all groups
    const groups = await prisma.habitGroup.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { habits: true }
        }
      }
    });

    // Calculate some statistics
    const totalLogs = await prisma.habitLog.count({
      where: { habit: { userId: user.id } }
    });

    const completedLogs = await prisma.habitLog.count({
      where: { 
        habit: { userId: user.id },
        status: 'done'
      }
    });

    const exportData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportVersion: "1.0.0",
        totalHabits: habits.length,
        totalLogs,
        completedLogs,
        completionRate: totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0
      },
      user: userData,
      habits: habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        isArchived: habit.isArchived,
        createdAt: habit.createdAt,
        group: habit.group,
        totalLogs: habit.logs.length,
        completedLogs: habit.logs.filter(log => log.status === 'done').length,
        logs: habit.logs
      })),
      groups,
      summary: {
        memberSince: userData?.createdAt,
        activeHabits: habits.filter(h => !h.isArchived).length,
        archivedHabits: habits.filter(h => h.isArchived).length,
        totalGroups: groups.length
      }
    };

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `routiva-export-${timestamp}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}