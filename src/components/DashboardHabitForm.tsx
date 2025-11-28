'use client';

import { useTransition, useRef } from 'react';
import { toast } from '@/lib/toast';

export default function DashboardHabitForm({ 
  createHabit 
}: { 
  createHabit: (formData: FormData) => Promise<void>;
}) {
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
        placeholder="e.g. Read 10 pages"
        className="border rounded px-3 py-2 w-full max-w-md"
        required
        disabled={pending}
      />
      <button 
        type="submit" 
        disabled={pending}
        className="border rounded px-3 py-2 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
