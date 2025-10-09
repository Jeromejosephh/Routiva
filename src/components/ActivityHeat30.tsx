export const runtime = "nodejs";
export const revalidate = 60;

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

  const grouped = await prisma.habitLog.groupBy({
    by: ["date"],
    where: { date: { gte: from, lte: to }, habit: { userId } },
    _count: { _all: true },
  });

  const counts = new Map(
    grouped.map((g) => [ymdUTC(g.date), g._count._all as number])
  );
  const days: { key: string; label: string; count: number }[] = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    const key = ymdUTC(cursor);
    const label = `${cursor.getUTCMonth() + 1}/${cursor.getUTCDate()}`;
    days.push({ key, label, count: counts.get(key) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  const max = days.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  const totalCompletions = grouped.reduce((n, g) => n + (g._count._all as number), 0);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Last 30 days</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {totalCompletions} completions
            </span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-xs text-white/70">
          <span>Activity level</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-gray-200 dark:bg-gray-600"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-200 dark:bg-green-900/40"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-300 dark:bg-green-800/60"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-400 dark:bg-green-700/80"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-green-500 dark:bg-green-600"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
      
      {/* Chart area with subtle grid */}
      <div className="p-6">
        <div className="relative">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-20">
            {Array.from({length: 5}, (_, i) => (
              <div key={i} className="border-t border-gray-200 dark:border-gray-600"></div>
            ))}
          </div>
          
          <div className="relative flex flex-wrap gap-1">
            {days.map((d) => {
              const t = d.count / max;
              const style =
                t === 0
                  ? { backgroundColor: "#e5e7eb" }
                  : { backgroundColor: `rgba(34, 197, 94, ${0.3 + t * 0.7})` };
              return (
                <div
                  key={d.key}
                  className="h-6 w-6 rounded-sm border border-gray-200 dark:border-gray-600"
                  style={style}
                  title={`${d.label}: ${d.count} completions`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
