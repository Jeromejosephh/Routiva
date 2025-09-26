// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export default async function HabitsPage() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({ where: { userId: user.id } });

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
          <li key={h.id} className="border p-3 rounded">
            {h.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
