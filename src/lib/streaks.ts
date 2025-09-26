// src/lib/streaks.ts
export function computeStreak(logs: { date: Date; status: string }[]) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const map = new Map(
    logs.map((l) => [new Date(l.date).setUTCHours(0, 0, 0, 0), l.status])
  );
  let streak = 0,
    cur = today.getTime();
  while (map.get(cur) === "done") {
    streak++;
    cur -= 86400000;
  }
  return streak;
}
