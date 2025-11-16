import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { habitCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";
import { rateLimitRequest, rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";
import { z } from "zod";

type HabitInput = z.infer<typeof habitCreate>;

function formToHabitInput(fd: FormData): HabitInput {
  const name = String(fd.get("name") ?? "");
  const description = fd.get("description");
  const targetDaysRaw = fd.get("targetDays");

  return {
    name,
    description: typeof description === "string" ? description : undefined,
    targetDays:
      typeof targetDaysRaw === "string" && targetDaysRaw !== ""
        ? Number(targetDaysRaw)
        : undefined,
  };
}



export async function GET(req: NextRequest) {
  try {
  const key = rateLimitRequest(req);
  await rateLimit(key);

    const user = await requireUser();
    
    // Check if completion data is requested
    const url = new URL(req.url);
    const wantsCompletion = url.searchParams.get('completion') === 'true';
    
    if (wantsCompletion) {
      // Calculate completion percentages
      const habits = await prisma.habit.findMany({
        where: { userId: user.id, isArchived: false },
        include: { logs: true }
      });
      
      if (habits.length === 0) {
        return NextResponse.json({
          dailyCompletion: 0,
          weeklyCompletion: 0,
          monthlyCompletion: 0,
        });
      }
      
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      const weekAgo = new Date(today);
      weekAgo.setUTCDate(today.getUTCDate() - 7);
      
      const monthAgo = new Date(today);
      monthAgo.setUTCDate(today.getUTCDate() - 30);
      
      // Daily completion
      const todayLogs = habits.filter(h => 
        h.logs.some(l => l.date.getTime() === today.getTime() && l.status === 'done')
      );
      const dailyCompletion = habits.length > 0 ? (todayLogs.length / habits.length) * 100 : 0;
      
      // Weekly completion
      const weeklyTotal = habits.length * 7;
      const weeklyCompleted = habits.reduce((sum, h) => 
        sum + h.logs.filter(l => l.date >= weekAgo && l.status === 'done').length, 0
      );
      const weeklyCompletion = weeklyTotal > 0 ? (weeklyCompleted / weeklyTotal) * 100 : 0;
      
      // Monthly completion
      const monthlyTotal = habits.length * 30;
      const monthlyCompleted = habits.reduce((sum, h) => 
        sum + h.logs.filter(l => l.date >= monthAgo && l.status === 'done').length, 0
      );
      const monthlyCompletion = monthlyTotal > 0 ? (monthlyCompleted / monthlyTotal) * 100 : 0;
      
      return NextResponse.json({
        dailyCompletion,
        weeklyCompletion,
        monthlyCompletion,
      });
    }
    
    const rows = await prisma.habit.findMany({
      where: { userId: user.id, isArchived: false },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        weeklyTarget: true,
        isArchived: true,
        color: true,
        priority: true,
        timeOfDay: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
  logger.info("Retrieved habits", { userId: user.id, metadata: { count: rows.length } });
    return NextResponse.json(rows);
  } catch (error) {
    logger.error("Failed to get habits", { 
      error: error instanceof Error ? error : new Error(String(error))
    });
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  const key = rateLimitRequest(req);
  await rateLimit(key);

    const user = await requireUser();
    const ct = req.headers.get("content-type") ?? "";

    let candidate: unknown;
    if (ct.includes("application/json")) {
      candidate = await req.json();
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const fd = await req.formData();
      candidate = formToHabitInput(fd);
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    const parsed = habitCreate.safeParse(candidate);
    if (!parsed.success) {
      logger.warn("Invalid habit creation request", { 
        userId: user.id, 
        metadata: { errors: parsed.error.format() } 
      });
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const { sanitizeHabitName, sanitizeHabitDescription } = await import("@/lib/sanitize");
    const sanitizedName = sanitizeHabitName(parsed.data.name);
    const sanitizedDescription = sanitizeHabitDescription(parsed.data.description);

    const row = await prisma.habit.create({
      data: { 
        ...parsed.data, 
        name: sanitizedName,
        description: sanitizedDescription,
        userId: user.id 
      },
    });

  logger.info("Created habit", { userId: user.id, metadata: { habitId: row.id } });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    logger.error("Failed to create habit", { 
      error: error instanceof Error ? error : new Error(String(error))
    });
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
