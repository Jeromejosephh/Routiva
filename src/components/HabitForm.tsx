"use client";

import { useThemeClasses } from "@/components/ThemeProvider";

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

  return (
    <form action={createHabit} className="flex gap-2 items-center">
      <input
        name="name"
        placeholder="New habit name"
        className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        required
      />
      <select
        name="groupId"
        className="border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
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
        className={`rounded px-3 py-2 text-white font-medium ${themeClasses.button}`}
      >
        Add
      </button>
    </form>
  );
}