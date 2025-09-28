// src/components/StreakBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { computeStreak } from "@/lib/streaks";

type HabitLogDTO = { date: string; status: string; note?: string | null };

export default function StreakBadge({ habitId }: { habitId: string }) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const to = new Date();
      to.setUTCHours(0, 0, 0, 0);
      const from = new Date(to);
      from.setUTCDate(to.getUTCDate() - 90);
      const qs = `from=${from.toISOString().slice(0, 10)}&to=${to
        .toISOString()
        .slice(0, 10)}`;

      const res = await fetch(`/api/habits/${habitId}/logs?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data: { logs: HabitLogDTO[] } = await res.json();
      const normalized = data.logs.map((l): { date: Date; status: string } => ({
        date: new Date(l.date),
        status: l.status,
      }));

      const s = computeStreak(normalized);
      if (!cancelled) setStreak(s);
    })();

    return () => {
      cancelled = true;
    };
  }, [habitId]);

  return (
    <span className="text-sm text-muted-foreground">
      {streak ?? "—"} day streak
    </span>
  );
}
