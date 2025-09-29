// src/lib/components/HabitRow.tsx
"use client";

import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

export default function HabitRow({
  habitId,
  initialChecked,
}: {
  habitId: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [pending, start] = useTransition();

  const onToggle = () => {
    const next = !checked;
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
              body: JSON.stringify({ date, status: "done" }),
            })
          : await fetch(
              `/api/habits/${habitId}/logs?date=${encodeURIComponent(date)}`,
              { method: "DELETE" }
            );

        if (!res.ok) {
          setChecked(!next);
          throw new Error(await safeText(res));
        }
      } catch (e: any) {
        toast(`Could not update: ${e?.message ?? "network error"}`);
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

async function safeText(r: Response) {
  try {
    const t = await r.text();
    return t?.slice(0, 180) || r.statusText;
  } catch {
    return r.statusText;
  }
}
