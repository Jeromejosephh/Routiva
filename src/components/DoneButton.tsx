"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function yyyymmddUtc(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DoneButton({
  habitId,
  initialChecked,
}: {
  habitId: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const today = yyyymmddUtc();

    if (!checked) {
      const res = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, status: "done" }),
      });
      if (res.ok) setChecked(true);
    } else {
      const res = await fetch(`/api/habits/${habitId}/logs?date=${today}`, {
        method: "DELETE",
      });
      if (res.ok) setChecked(false);
    }

    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={() => startTransition(toggle)}
      disabled={pending}
      className="rounded px-3 py-1 border disabled:opacity-50"
      aria-pressed={checked}
      title={checked ? "Undo today" : "Mark done today"}
    >
      {checked ? "✓ Done" : "Mark done"}
    </button>
  );
}
