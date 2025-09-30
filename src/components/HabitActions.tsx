// src/components/HabitActions.tsx
"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import {
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
} from "lucide-react";

type HabitPatchBody = {
  name?: string;
  isArchived?: boolean;
  weeklyTarget?: number;
  tags?: string[];
  color?: string;
};

export default function HabitActions({
  habitId,
  name,
  isArchived,
}: {
  habitId: string;
  name: string;
  isArchived: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const close = (): void => detailsRef.current?.removeAttribute("open");

  const patch = async (body: HabitPatchBody): Promise<void> => {
    const res = await fetch(`/api/habits/${habitId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const rename = (): void => {
    const next = window.prompt("Rename habit", name)?.trim();
    if (!next || next === name) return;
    start(async () => {
      try {
        await patch({ name: next });
        close();
        router.refresh();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "error";
        toast(`Rename failed: ${msg}`);
      }
    });
  };

  const toggleArchive = (): void =>
    start(async () => {
      try {
        await patch({ isArchived: !isArchived });
        close();
        router.refresh();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "error";
        toast(`Update failed: ${msg}`);
      }
    });

  const del = (): void => {
    if (!window.confirm("Delete this habit? This removes its logs.")) return;
    start(async () => {
      try {
        const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await res.text());
        close();
        router.refresh();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "error";
        toast(`Delete failed: ${msg}`);
      }
    });
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="flex h-9 w-9 items-center justify-center rounded border bg-background hover:bg-muted cursor-pointer list-none"
        aria-label="Actions"
        role="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border bg-background shadow">
        <button
          type="button"
          onClick={rename}
          disabled={pending}
          className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted text-left"
        >
          <Pencil className="h-4 w-4" /> Rename
        </button>
        <button
          type="button"
          onClick={toggleArchive}
          disabled={pending}
          className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted text-left"
        >
          {isArchived ? (
            <ArchiveRestore className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
          {isArchived ? "Unarchive" : "Archive"}
        </button>
        <div className="my-1 h-px bg-border" />
        <button
          type="button"
          onClick={del}
          disabled={pending}
          className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted text-left text-red-600"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </details>
  );
}
