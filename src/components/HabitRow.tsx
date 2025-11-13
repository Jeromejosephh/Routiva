// src/components/HabitRow.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "@/lib/toast";
import { celebrateStreakMilestone } from "@/lib/confetti";
import { computeCurrentStreak } from "@/lib/analytics";

export default function HabitRow({
  habitId,
  initialChecked,
}: {
  habitId: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(initialChecked);
  const [pending, start] = useTransition();
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Fetch current streak on mount
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const to = new Date();
        to.setUTCHours(0, 0, 0, 0);
        const from = new Date(to);
        from.setUTCDate(to.getUTCDate() - 90);
        const qs = `from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`;

        const res = await fetch(`/api/habits/${habitId}/logs?${qs}`, {
          cache: "no-store",
        });
        
        if (res.ok) {
          const data: { logs: Array<{ date: string; status: string }> } = await res.json();
          const normalized = data.logs.map((l) => ({
            date: new Date(l.date),
            status: l.status,
          }));
          const streak = computeCurrentStreak(normalized);
          setCurrentStreak(streak);
        }
      } catch (error) {
        console.error("Failed to fetch streak:", error);
      }
    };

    fetchStreak();
  }, [habitId]);

  const onToggle = (): void => {
    const next = !checked;
    const wasChecked = checked;
    setChecked(next);

    start(async () => {
      const day = new Date();
      day.setUTCHours(0, 0, 0, 0);
      const date = day.toISOString();

      try {
        const res = next
          ? await fetch(`/api/habits/${habitId}/logs`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ date, status: "done" as const }),
            })
          : await fetch(
              `/api/habits/${habitId}/logs?date=${encodeURIComponent(date)}`,
              { method: "DELETE" }
            );

        if (!res.ok) {
          setChecked(!next);
          throw new Error(await safeText(res));
        }

        // Trigger confetti on completion (not on uncheck)
        if (next && !wasChecked) {
          // Calculate new streak (current + 1 if completing today extends it)
          const newStreak = currentStreak + 1;
          setCurrentStreak(newStreak);
          
          // Trigger appropriate confetti based on streak
          celebrateStreakMilestone(newStreak);
        } else if (!next) {
          // Decrement streak if unchecking
          setCurrentStreak(Math.max(0, currentStreak - 1));
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "network error";
        toast(`Could not update: ${msg}`);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-pressed={checked}
      className={`h-9 px-3 rounded border text-sm transition ${
        checked
          ? "bg-emerald-600 text-white border-emerald-500"
          : "bg-transparent hover:bg-zinc-900/40"
      } ${pending ? "opacity-70" : ""}`}
    >
      {checked ? "✓ Done" : "Mark done"}
    </button>
  );
}

async function safeText(r: Response): Promise<string> {
  try {
    const t = await r.text();
    return t?.slice(0, 180) || r.statusText;
  } catch {
    return r.statusText;
  }
}
