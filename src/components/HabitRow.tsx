"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
  const [pending, start] = useTransition();
  const router = useRouter();

  async function toggle() {
    const today = yyyymmddUtc();
    if (!checked) {
      const r = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, status: "done" }),
      });
      if (r.ok) setChecked(true);
    } else {
      const r = await fetch(`/api/habits/${habitId}/logs?date=${today}`, {
        method: "DELETE",
      });
      if (r.ok) setChecked(false);
    }
    start(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={() => start(toggle)}
      disabled={pending}
      className="rounded px-3 py-1 border disabled:opacity-50"
      aria-pressed={checked}
    >
      {checked ? "✓ Done" : "Mark done"}
    </button>
  );
}
