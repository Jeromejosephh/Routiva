// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import HabitActions from "@/components/HabitActions";
import GroupManager from "@/components/GroupManager";
import { revalidatePath } from "next/cache";

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
      <form action={createHabit} className="flex gap-2 items-center">
        <input
          name="name"
          placeholder="New habit name"
          className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          required
        />
        <select
          name="groupId"
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="">No Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.icon} {group.name}
            </option>
          ))}
        </select>
        <button type="submit" className="border rounded px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
          Add
        </button>
      </form>

      <h1 className="text-xl font-semibold text-center">Habits</h1>

      <GroupManager groups={groups} />

      {habits.length === 0 ? (
        <div className="rounded border p-4 text-sm text-muted-foreground">
          No habits yet. Add one above to get started!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group habits by their group */}
          {(() => {
            const groupedHabits: Record<string, typeof habits> = {};
            const ungroupedHabits: typeof habits = [];
            
            habits.forEach((habit) => {
              if (habit.group) {
                const groupId = habit.group.id;
                if (!groupedHabits[groupId]) {
                  groupedHabits[groupId] = [];
                }
                groupedHabits[groupId].push(habit);
              } else {
                ungroupedHabits.push(habit);
              }
            });

            return (
              <>
                {/* Grouped habits */}
                {Object.entries(groupedHabits).map(([groupId, groupHabits]) => {
                  const group = groups.find((g) => g.id === groupId);
                  if (!group) return null;
                  
                  const colorMap: Record<string, string> = {
                    blue: 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800/30',
                    green: 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-800/30',
                    purple: 'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-800/30',
                    red: 'bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800/30',
                    orange: 'bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-800/30',
                    yellow: 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800/30',
                    pink: 'bg-pink-100 border-pink-300 dark:bg-pink-900/20 dark:border-pink-800/30',
                    teal: 'bg-teal-100 border-teal-300 dark:bg-teal-900/20 dark:border-teal-800/30',
                    gray: 'bg-gray-100 border-gray-300 dark:bg-gray-900/20 dark:border-gray-800/30',
                  };
                  const colorClass = colorMap[group.color] || 'bg-gray-100 border-gray-300';

                  return (
                    <div key={groupId} className={`border rounded-lg p-4 ${colorClass}`}>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <span className="text-lg">{group.icon}</span>
                        {group.name}
                        <span className="text-sm text-gray-600">({groupHabits.length})</span>
                      </h3>
                      <ul className="space-y-2">
                        {groupHabits.map((h) => (
                          <li key={h.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded">
                            <div className="flex items-center justify-between">
                              <span className={h.isArchived ? "opacity-60 line-through" : ""}>
                                {h.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <HabitRow habitId={h.id} initialChecked={doneSet.has(h.id)} />
                                <HabitActions
                                  habitId={h.id}
                                  name={h.name}
                                  isArchived={h.isArchived}
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                {/* Ungrouped habits */}
                {ungroupedHabits.length > 0 && (
                  <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                    <h3 className="font-medium mb-3">Ungrouped Habits ({ungroupedHabits.length})</h3>
                    <ul className="space-y-2">
                      {ungroupedHabits.map((h) => (
                        <li key={h.id} className="border p-3 rounded border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center justify-between">
                            <span className={h.isArchived ? "opacity-60 line-through" : ""}>
                              {h.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <HabitRow habitId={h.id} initialChecked={doneSet.has(h.id)} />
                              <HabitActions
                                habitId={h.id}
                                name={h.name}
                                isArchived={h.isArchived}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
