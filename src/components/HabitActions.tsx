"use client";

//dropdown menu for habit edit/archive/delete actions
import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const updateMenuPos = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 220;
    const margin = 8;
    const left = Math.min(
      Math.max(rect.right - menuWidth, margin),
      window.innerWidth - menuWidth - margin
    );
    const top = rect.bottom + margin;
    setMenuPos({ top, left });
  };

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) updateMenuPos();
      return next;
    });
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const handleResizeScroll = () => {
      if (open) updateMenuPos();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll, true);
    };
  }, [open]);

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
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label="Actions"
        className="flex h-9 w-9 items-center justify-center rounded border bg-background hover:bg-muted cursor-pointer"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[99999] min-w-[220px]"
            style={{ top: menuPos.top, left: menuPos.left }}
            ref={menuRef}
          >
            <div className="rounded-xl border border-white/20 bg-white dark:bg-gray-800 shadow-2xl flex flex-col gap-2 p-2 w-full backdrop-blur-sm">
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
          </div>,
          document.body
        )}
    </div>
  );
}
