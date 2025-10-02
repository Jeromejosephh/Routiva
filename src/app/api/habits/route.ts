// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { habitCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";
import { rateLimitRequest } from "@/lib/rate-limit";
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

const getRequestIp = (req: Request) => {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).ip ?? 'unknown';
};

export async function GET(req: NextRequest) {
  try {
  // Rate limiting
  const ip = getRequestIp(req);
  await rateLimitRequest(ip);

    const user = await requireUser();
    
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
  // Rate limiting
  const ip = getRequestIp(req);
  await rateLimitRequest(ip);

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

    // Sanitize input
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
