// src/components/StreakBadge.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { computeCurrentStreak } from "@/lib/analytics";

type HabitLogDTO = { date: string; status: string; note?: string | null };

export default function StreakBadge({ habitId }: { habitId: string }) {
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
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
        if (!res.ok) {
          if (!cancelled) setStreak(0);
          return;
        }

        const data: { logs: HabitLogDTO[] } = await res.json();
        const normalized = data.logs.map((l): { date: Date; status: string } => ({
          date: new Date(l.date),
          status: l.status,
        }));

        const s = computeCurrentStreak(normalized);
        if (!cancelled) {
          setStreak(s);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch streak:", error);
        if (!cancelled) {
          setStreak(0);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [habitId]);

  const displayText = useMemo(() => {
    if (loading) return "—";
    if (streak === null) return "—";
    return `${streak} day streak 🔥`;
  }, [streak, loading]);

  return (
    <span className="text-sm text-muted-foreground">
      {displayText}
    </span>
  );
}
