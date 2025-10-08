import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { rateLimitRequest, rateLimit } from "@/lib/rate-limit";
import { logCreate } from "@/lib/validators";
import { logger } from "@/lib/logger";

//utility functions for request processing
function getRequestIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  return real ?? "unknown";
}

function toUtcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

function extractHabitIdFromUrl(req: NextRequest): string | null {
  try {
    const pathname = req.nextUrl?.pathname ?? new URL(req.url).pathname;
    const m = pathname.match(/\/api\/habits\/([^/]+)\/logs/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

//create a new habit log entry
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const key = rateLimitRequest(req);
    await rateLimit(key);

  const ip = getRequestIp(req.headers);

  const habitId = extractHabitIdFromUrl(req);
  if (!habitId) {
    return NextResponse.json(
      { error: "Invalid habit id in URL" },
      { status: 400 }
    );
  }

  //verify user owns this habit
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
    select: { id: true },
  });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let raw: Record<string, unknown> = {};

  if (contentType.includes("application/json")) {
    const body: unknown = await req.json();
    raw =
      body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } else if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    const obj: Record<string, unknown> = {};
    for (const [k, v] of fd.entries()) {
      obj[k] = typeof v === "string" ? v : (v as File).name;
    }
    raw = obj;
  } else {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 415 }
    );
  }

  // Validate with Zod
  const candidate = { date: raw.date, status: raw.status, note: raw.note };
  const parsed = logCreate.parse(candidate);

  // Normalise date to UTC midnight
  const dateInput =
    parsed.date instanceof Date ? parsed.date : new Date(String(parsed.date));
  const dateUtc = toUtcMidnight(dateInput);

  // Upsert by composite unique (habitId, date)
  const result = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId, date: dateUtc } },
    create: {
      habitId,
      date: dateUtc,
      status: parsed.status,
      note: typeof parsed.note === "string" ? parsed.note : null,
    },
    update: {
      status: parsed.status,
      note: typeof parsed.note === "string" ? parsed.note : null,
    },
    select: { id: true, habitId: true, date: true, status: true, note: true },
  });

  logger.info("habitLog upsert", {
    userId: user.id,
    habitId,
    logId: result.id,
    status: result.status,
    ip,
  });

  return NextResponse.json(
    {
      id: result.id,
      habitId: result.habitId,
      date: result.date.toISOString(),
      status: result.status,
      note: result.note,
    },
    { status: 200 }
  );
  } catch (error) {
    logger.error("Failed to create/update habit log", {
      error: error instanceof Error ? error : new Error(String(error))
    });

    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();

    // Rate limiting
    const key = rateLimitRequest(req);
    await rateLimit(key);

    const ip = getRequestIp(req.headers);

    const habitId = extractHabitIdFromUrl(req);
    if (!habitId) {
      return NextResponse.json(
        { error: "Invalid habit id in URL" },
        { status: 400 }
      );
    }

    // Ensure the habit belongs to the user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: user.id },
      select: { id: true },
    });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Get date from query parameter
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Normalise date to UTC midnight
    const dateInput = new Date(dateParam);
    const dateUtc = toUtcMidnight(dateInput);

    // Delete the habit log entry
    const deletedLog = await prisma.habitLog.deleteMany({
      where: {
        habitId,
        date: dateUtc,
      },
    });

    logger.info("habitLog deleted", {
      userId: user.id,
      habitId,
      date: dateUtc.toISOString(),
      deletedCount: deletedLog.count,
      ip,
    });

    return NextResponse.json({
      success: true,
      deletedCount: deletedLog.count,
    });
  } catch (error) {
    logger.error("Failed to delete habit log", {
      error: error instanceof Error ? error : new Error(String(error))
    });

    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }
}
