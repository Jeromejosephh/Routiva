// src/components/ActivityHeat30.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/db";

function ymdUTC(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export default async function ActivityHeat30({ userId }: { userId: string }) {
  const to = new Date();
  to.setUTCHours(0, 0, 0, 0);
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - 29);

  let logs: { date: Date }[] = [];
  try {
    logs = await prisma.habitLog.findMany({
      where: { date: { gte: from, lte: to }, habit: { userId } },
      select: { date: true },
    });
  } catch (e) {
    return (
      <div className="mt-6 rounded border p-4">
        <h2 className="text-lg font-semibold mb-2">Last 30 days</h2>
        <p className="text-sm text-red-400">
          Activity could not load (server runtime).{" "}
        </p>
      </div>
    );
  }

  const counts = new Map<string, number>();
  for (const l of logs) {
    const k = ymdUTC(new Date(l.date));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  const days: { key: string; label: string; count: number }[] = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    const key = ymdUTC(cursor);
    const label = `${cursor.getUTCMonth() + 1}/${cursor.getUTCDate()}`;
    days.push({ key, label, count: counts.get(key) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const max = days.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <div className="mt-6 rounded border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Last 30 days</h2>
        <div className="text-sm text-muted-foreground">
          {logs.length} completions in range
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {days.map((d) => {
          const t = d.count / max;
          const style =
            t === 0
              ? { backgroundColor: "#3f3f46" }
              : { backgroundColor: `rgba(16,185,129, ${0.25 + t * 0.6})` };
          return (
            <div
              key={d.key}
              className="h-6 w-6 rounded border border-zinc-600/40"
              style={style}
              title={`${d.label}: ${d.count} done`}
            />
          );
        })}
      </div>
    </div>
  );
}
