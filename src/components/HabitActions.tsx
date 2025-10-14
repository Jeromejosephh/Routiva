"use client";

//dropdown menu for habit edit/archive/delete actions
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
    
    if (next.length === 0) {
      toast("Habit name cannot be empty");
      return;
    }
    if (next.length > 60) {
      toast("Habit name must be 60 characters or less");
      return;
    }
    
    start(async () => {
      try {
        await patch({ name: next });
        close();
        router.refresh();
        toast("Habit renamed successfully");
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
    <details ref={detailsRef} className="relative z-[10000]">
      <summary
        className="flex h-9 w-9 items-center justify-center rounded border bg-background hover:bg-muted cursor-pointer list-none"
        aria-label="Actions"
        role="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </summary>
      <div
        className="absolute right-0 top-full mt-2 z-[10001] min-w-[180px]"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="rounded-xl border border-white/20 bg-white dark:bg-gray-800 shadow-2xl flex flex-col gap-2 p-2 w-full backdrop-blur-sm"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            type="button"
            onClick={rename}
            disabled={pending}
            className="flex w-full items-center gap-2 px-3 py-3 hover:bg-muted/50 text-left text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] rounded-lg"
          >
            <Pencil className="h-4 w-4" /> Rename
          </button>
          <button
            type="button"
            onClick={toggleArchive}
            disabled={pending}
            className="flex w-full items-center gap-2 px-3 py-3 hover:bg-muted/50 text-left text-white transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] rounded-lg"
          >
            {isArchived ? (
              <ArchiveRestore className="h-4 w-4" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
            {isArchived ? "Unarchive" : "Archive"}
          </button>
          <button
            type="button"
            onClick={del}
            disabled={pending}
            className="flex w-full items-center gap-2 px-3 py-3 hover:bg-muted/50 text-left text-red-600 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] rounded-lg"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </details>
  );
}
