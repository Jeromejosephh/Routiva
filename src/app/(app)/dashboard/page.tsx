// src/app/(app)/dashboard/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import StreakBadge from "@/components/StreakBadge";
//import ActivityHeat30 from "@/components/ActivityHeat30";
import ActivityHeat30 from "../../../components/ActivityHeat30";

export default async function DashboardPage() {
  const user = await requireUser();

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const logsToday = await prisma.habitLog.findMany({
    where: { habitId: { in: habits.map((h) => h.id) }, date: today },
    select: { habitId: true },
  });
  const doneSet = new Set(logsToday.map((l) => l.habitId));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Today</h1>
      <ActivityHeat30 userId={user.id} />
      <div className="text-amber-400 font-semibold">—— DEBUG BELOW ——</div>

      <ul className="space-y-2">
        {habits.map((h) => (
          <li
            key={h.id}
            className="border p-3 rounded flex items-center justify-between"
          >
            <span>{h.name}</span>
            <div className="flex items-center gap-3">
              <StreakBadge habitId={h.id} />
              <HabitRow habitId={h.id} initialChecked={doneSet.has(h.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
