// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import HabitActions from "@/components/HabitActions";
import { revalidatePath } from "next/cache";

async function createHabit(formData: FormData) {
  "use server";
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  try {
    await prisma.habit.create({ data: { name, userId: user.id } });
  } catch {}
  revalidatePath("/habits");
}

export default async function HabitsPage() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: [{ isArchived: "asc" }, { createdAt: "desc" }],
  });

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
          className="border rounded px-3 py-2"
          required
        />
        <button type="submit" className="border rounded px-3 py-2">
          Add
        </button>
      </form>

      <h1 className="text-xl font-semibold">Your habits</h1>
      <ul className="space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="border p-3 rounded">
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
}
