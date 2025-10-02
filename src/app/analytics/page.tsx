import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth-helpers';
import { computeCompletionRate } from '@/lib/analytics';

export default async function AnalyticsPage() {
  const user = await requireUser('/analytics');

  // last 30 days
  const to = new Date();
  to.setUTCHours(0,0,0,0);
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - 29);

  const logs = await prisma.habitLog.findMany({
    where: { date: { gte: from, lte: to }, habit: { userId: user.id } },
    select: { status: true, date: true },
  });

  const completionRate = computeCompletionRate(logs);

  return (
    <div>
      <h1>Analytics</h1>
      <p>Completion rate (last 30 days): {Math.round(completionRate*100)}%</p>
      <pre>{JSON.stringify({from: from.toISOString(), to: to.toISOString(), logsCount: logs.length}, null, 2)}</pre>
    </div>
  );
}
