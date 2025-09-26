// src/app/(app)/dashboard/page.tsx
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";

export default async function Dashboard() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Today</h1>
      <ul className="space-y-2">
        {habits.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <span>{h.name}</span>
            <form action={`/api/habits/${h.id}/logs`} method="post">
              <input type="hidden" name="status" value="done" />
              <input
                type="hidden"
                name="date"
                value={new Date().toISOString()}
              />
              <button className="border px-3 py-1 rounded">Done</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
