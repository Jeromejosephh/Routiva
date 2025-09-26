// src/app/(app)/habits/page.tsx
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function HabitsPage() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({ where: { userId: user.id } });

  return (
    <div className="space-y-6">
      <form action="/api/habits" method="post" className="flex gap-2">
        <Link href="/dashboard" className="text-sm underline">
          Back
        </Link>
      </form>
      <h1 className="text-xl font-semibold">Your habits</h1>
      <pre className="text-sm bg-neutral-950 text-neutral-200 p-3 rounded overflow-auto">
        {JSON.stringify(habits, null, 2)}
      </pre>
    </div>
  );
}
