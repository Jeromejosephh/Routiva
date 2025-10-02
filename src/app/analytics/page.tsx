import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth-helpers';
import { computeCompletionRate, computeCurrentStreak, buildSeries } from '@/lib/analytics';
import HabitChart from '@/components/HabitChart';

export default async function AnalyticsPage() {
  const user = await requireUser('/analytics');

  const to = new Date();
  to.setUTCHours(0,0,0,0);
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - 29);

  const habits = await prisma.habit.findMany({ where: { userId: user.id, isArchived: false } });

  const habitStats = await Promise.all(habits.map(async (h) => {
    const logs = await prisma.habitLog.findMany({
      where: { habitId: h.id, date: { gte: from, lte: to } },
      select: { status: true, date: true }
    });
    const completionRate = computeCompletionRate(logs);
    const streak = computeCurrentStreak(logs);
    const series = buildSeries(from, to, logs);
    return { habit: h, completionRate, streak, series };
  }));

  return (
    <div>
      <h1>Analytics</h1>
      {habitStats.map((s) => (
        <section key={s.habit.id}>
          <h2>{s.habit.name}</h2>
          <p>Completion: {Math.round(s.completionRate*100)}% • Streak: {s.streak}</p>
          <HabitChart series={s.series} />
        </section>
      ))}
    </div>
  );
}
