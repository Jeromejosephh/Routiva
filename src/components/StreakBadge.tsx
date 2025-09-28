// src/components/StreakBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { computeStreak } from "@/lib/streaks";

export default function StreakBadge({ habitId }: { habitId: string }) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
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
      const { logs } = await res.json();
      const s = computeStreak(
        logs.map((l: any) => ({ date: new Date(l.date), status: l.status }))
      );
      setStreak(s);
    })();
  }, [habitId]);

  return (
    <span className="text-sm text-muted-foreground">
      {streak ?? "—"} day streak
    </span>
  );
}
