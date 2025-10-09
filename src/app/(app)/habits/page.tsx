// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import GroupManager from "@/components/GroupManager";
import HabitForm from "@/components/HabitForm";
import HabitList from "@/components/HabitList";

async function createHabit(formData: FormData) {
  "use server";
  try {
    const user = await requireUser();
    const name = String(formData.get("name") ?? "").trim();
    const groupId = String(formData.get("groupId") ?? "") || null;
    
    if (!name) {
      throw new Error("Habit name is required");
    }

    // Sanitize input
    const { sanitizeHabitName } = await import("@/lib/sanitize");
    const sanitizedName = sanitizeHabitName(name);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).habit.create({ 
      data: { 
        name: sanitizedName, 
        userId: user.id,
        groupId: groupId
      } 
    });

    revalidatePath("/habits");
    revalidatePath("/dashboard");
  } catch (error) {
    const { logger } = await import("@/lib/logger");
    logger.error("Failed to create habit", { 
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { formData: Object.fromEntries(formData.entries()) }
    });
    
    throw new Error("Failed to create habit. Please try again.");
  }
}

type HabitWithGroup = {
  id: string;
  name: string;
  isArchived: boolean;
  group?: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  } | null;
};

type GroupWithCount = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  _count: { habits: number };
};

export default async function HabitsPage() {
  const user = await requireUser();
  
  // Fetch habits with their groups
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const habits = await (prisma as any).habit.findMany({
    where: { userId: user.id },
    include: { group: true },
    orderBy: [{ isArchived: "asc" }, { createdAt: "desc" }],
  }) as HabitWithGroup[];

  // Fetch groups for the create form and group management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groups = await (prisma as any).habitGroup.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { habits: true } }
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  }) as GroupWithCount[];

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const logsToday = await prisma.habitLog.findMany({
    where: { habitId: { in: habits.map((h) => h.id) }, date: today },
    select: { habitId: true },
  });
  const doneSet = new Set(logsToday.map((l) => l.habitId));

  return (
    <div className="space-y-6">
      <HabitForm groups={groups} createHabit={createHabit} />

      <h1 className="text-xl font-semibold text-center">Habits</h1>

      <GroupManager groups={groups} />

      <HabitList 
        habits={habits.map(h => ({
          id: h.id,
          name: h.name,
          groupId: h.group?.id || null,
          isArchived: h.isArchived
        }))} 
        groups={groups} 
        doneSet={doneSet} 
      />
    </div>
  );
}
