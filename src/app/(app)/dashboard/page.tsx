// src/app/(app)/dashboard/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import StreakBadge from "@/components/StreakBadge";
import ActivityHeat30 from "@/components/ActivityHeat30";
import { revalidatePath } from "next/cache";

async function createHabit(formData: FormData) {
  "use server";
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  try {
    await prisma.habit.create({ data: { name, userId: user.id } });
  } catch {}
  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

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

  const isEmpty = habits.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Today</h1>

      <ActivityHeat30 userId={user.id} />

      {isEmpty ? (
        <div className="rounded border p-4">
          <p className="mb-3 text-sm text-muted-foreground">
            You don’t have any habits yet. Create your first one:
          </p>
          <form action={createHabit} className="flex gap-2 items-center">
            <input
              name="name"
              placeholder="e.g. Read 10 pages"
              className="border rounded px-3 py-2 w-full max-w-md"
              required
            />
            <button type="submit" className="border rounded px-3 py-2">
              Add
            </button>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
}
