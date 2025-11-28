"use client";

import { useTransition, useRef } from "react";
import { useThemeClasses } from "@/components/ThemeProvider";
import { toast } from "@/lib/toast";

type Group = {
  id: string;
  name: string;
  icon?: string;
};

export default function HabitForm({ 
  groups, 
  createHabit 
}: { 
  groups: Group[];
  createHabit: (formData: FormData) => void;
}) {
  const themeClasses = useThemeClasses();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createHabit(formData);
        formRef.current?.reset();
        toast({ message: "Habit created!", variant: "success" });
      } catch (error) {
        toast({ 
          message: error instanceof Error ? error.message : "Failed to create habit", 
          variant: "error" 
        });
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 items-center">
      <input
        name="name"
        placeholder="New habit name"
        className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-white placeholder-gray-500 dark:placeholder-gray-400"
        required
        disabled={pending}
      />
      <select
        name="groupId"
        className="border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-white"
        disabled={pending}
      >
        <option value="">No Group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.icon} {group.name}
          </option>
        ))}
      </select>
      <button 
        type="submit" 
        disabled={pending}
        className={`rounded px-3 py-2 text-white font-medium ${themeClasses.button} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}