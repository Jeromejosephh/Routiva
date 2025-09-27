"use client";

import { useState, useTransition } from "react";

function yyyymmddUtc(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function HabitRow({
  habitId,
  initialChecked,
}: {
  habitId: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    const today = yyyymmddUtc();

    if (!checked) {
      //mark done (create/update)
      const res = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, status: "DONE" }),
      });
      if (res.ok) setChecked(true);
    } else {
      //undo (delete)
      const res = await fetch(`/api/habits/${habitId}/logs?date=${today}`, {
        method: "DELETE",
      });
      if (res.ok) setChecked(false);
    }
  }

  return (
    <button
      onClick={() => startTransition(toggle)}
      className="rounded px-3 py-1 border disabled:opacity-50"
      disabled={isPending}
      aria-pressed={checked}
      title={checked ? "Undo today" : "Mark done today"}
    >
      {checked ? "✓ Done" : "Mark done"}
    </button>
  );
}
