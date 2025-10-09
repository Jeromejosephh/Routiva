import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import HabitRow from "@/components/HabitRow";
import ActivityHeat30 from "@/components/ActivityHeat30";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your habit tracking dashboard - view today's habits, track progress, and see your activity heatmap. Stay consistent with your daily routines.",
  openGraph: {
    title: "Dashboard | Routiva",
    description: "Track your daily habits and view your progress with Routiva's intuitive dashboard.",
  },
};

//server action to create new habits from dashboard
async function createHabit(formData: FormData) {
  "use server";
  try {
    const user = await requireUser();
    const name = String(formData.get("name") ?? "").trim();
    
    if (!name) {
      throw new Error("Habit name is required");
    }

    const { sanitizeHabitName } = await import("@/lib/sanitize");
    const sanitizedName = sanitizeHabitName(name);

    await prisma.habit.create({ 
      data: { 
        name: sanitizedName, 
        userId: user.id 
      } 
    });

    revalidatePath("/dashboard");
    revalidatePath("/habits");
  } catch (error) {
    const { logger } = await import("@/lib/logger");
    logger.error("Failed to create habit", { 
      error: error instanceof Error ? error : new Error(String(error)),
      metadata: { formData: Object.fromEntries(formData.entries()) }
    });
    
    throw new Error("Failed to create habit. Please try again.");
  }
}

export default async function DashboardPage() {
  const user = await requireUser();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  //fetch user habits with today's completion status
  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      logs: {
        where: { date: today },
        select: { status: true }
      }
    }
  });

  type HabitWithLogs = {
    id: string;
    name: string;
    logs: Array<{ status: string }>;
  };

  const doneSet = new Set(
    (habits as HabitWithLogs[])
      .filter((h) => h.logs.some((log) => log.status === 'done'))
      .map((h) => h.id)
  );

  const isEmpty = habits.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-center">Dashboard</h1>

      {/* Page intro row with date and week blurb */}
      <div className="flex items-center justify-between py-2 px-1">
        <div>
          <p className="text-sm text-white/70">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-white/60 dark:text-white/60 mt-0.5">
            Your week at a glance
          </p>
        </div>
      </div>

      <ActivityHeat30 userId={user.id} />

      {isEmpty ? (
        <div className="rounded border p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <p className="mb-3 text-sm text-muted-foreground">
            You don’t have any habits yet. Create your first one:
          </p>
          <form action={createHabit} className="flex gap-2 items-center">
            <input
              name="name"
              placeholder="e.g. Read 10 pages"
              className="border rounded px-3 py-2 w-full max-w-md"
              required
            />
            <button type="submit" className="border rounded px-3 py-2 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-50 dark:hover:bg-gray-700">
              Add
            </button>
          </form>
        </div>
      ) : (
        <ul className="space-y-2">
          {(habits as HabitWithLogs[]).map((h) => (
            <li
              key={h.id}
              className="border p-3 rounded flex items-center justify-between backdrop-blur-sm bg-white/60 dark:bg-gray-700/60"
            >
              <span>{h.name}</span>
              <div className="flex items-center gap-3">
                <HabitRow habitId={h.id} initialChecked={doneSet.has(h.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
