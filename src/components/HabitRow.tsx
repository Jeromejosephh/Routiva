//src/components/HabitRow.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function ymdUtc() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export default function HabitRow({
  habitId,
  initialChecked,
}: {
  habitId: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [isPending, start] = useTransition();
  const router = useRouter();

  async function toggle() {
    const date = ymdUtc();
    const res = await fetch(
      checked
        ? `/api/habits/${habitId}/logs?date=${date}`
        : `/api/habits/${habitId}/logs`,
      checked
        ? { method: "DELETE" }
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, status: "done" }),
          }
    );
    if (res.ok) {
      setChecked(!checked);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={() => start(toggle)}
      disabled={isPending}
      className="rounded px-3 py-1 border"
    >
      {checked ? "✓ Done" : "Mark done"}
    </button>
  );
}
