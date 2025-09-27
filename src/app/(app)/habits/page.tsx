// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";

export default async function HabitsPage() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Compute "checked today" on the server (UTC midnight)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const logsToday = await prisma.habitLog.findMany({
    where: { habitId: { in: habits.map((h) => h.id) }, date: today },
    select: { habitId: true },
  });
  const doneSet = new Set(logsToday.map((l) => l.habitId));

  return (
    <div className="space-y-6">
      <form
        action="/api/habits"
        method="post"
        className="flex gap-2 items-center"
      >
        <input
          name="name"
          placeholder="New habit name"
          className="border rounded px-3 py-2"
          required
        />
        <button className="border rounded px-3 py-2">Add</button>
      </form>

      <h1 className="text-xl font-semibold">Your habits</h1>

      <ul className="space-y-2">
        {habits.map((h) => (
          <li
            key={h.id}
            className="border p-3 rounded flex items-center justify-between"
          >
            <span>{h.name}</span>
            <HabitRow habitId={h.id} initialChecked={doneSet.has(h.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
