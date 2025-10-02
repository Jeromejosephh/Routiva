// src/app/api/habits/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";
import { rateLimitRequest } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const toUtcMidnight = (s: string) => {
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

//Get client IP from headers
const getRequestIp = (req: Request) => {
  // Prefer X-Forwarded-For (may contain comma-separated list)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  // Vercel / Cloudflare header
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf;

  // Fallback to any non-standard property if present (avoid TS error by casting)
  // This is a last resort and may be undefined in many runtimes.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).ip ?? 'unknown';
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  //RateLimit
  const ip = getRequestIp(req);
    await rateLimitRequest(ip);

    const { id } = await params;
    const user = await requireUser();

    const habit = await prisma.habit.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!habit) {
      logger.warn("Habit not found", { userId: user.id, metadata: { habitId: id } });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ct = req.headers.get("content-type") ?? "";
    let candidate: unknown;
    if (ct.includes("application/json")) {
      candidate = await req.json();
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const fd = await req.formData();
      candidate = {
        date: fd.get("date"),
        status: fd.get("status"),
        note: fd.get("note") ?? undefined,
      };
    } else {
      candidate = await req.json().catch(() => ({}));
    }

    const parsed = logCreate.safeParse(candidate);
    if (!parsed.success) {
      logger.warn("Invalid log creation request", { 
        userId: user.id, 
        metadata: { habitId: id, errors: parsed.error.format() } 
      });
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const date = toUtcMidnight(String(parsed.data.date));
    if (!date) {
      logger.warn("Invalid date provided", { 
        userId: user.id, 
        metadata: { habitId: id, date: parsed.data.date } 
      });
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

  //Sanitize note
    let sanitizedNote = parsed.data.note;
    if (sanitizedNote) {
      const { sanitizeText } = await import("@/lib/sanitize");
      sanitizedNote = sanitizeText(sanitizedNote);
    }

    const log = await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: habit.id, date } },
      update: { status: parsed.data.status, note: sanitizedNote },
      create: {
        habitId: habit.id,
        date,
        status: parsed.data.status,
        note: sanitizedNote,
      },
    });

    logger.info("Created/updated habit log", { 
      userId: user.id, 
      metadata: { habitId: id, logId: log.id, status: parsed.data.status } 
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    logger.error("Failed to create/update habit log", { 
      metadata: { error: error instanceof Error ? error : new Error(String(error)) }
    });
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireUser();

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const date = dateParam && toUtcMidnight(dateParam);
  if (!date)
    return NextResponse.json(
      { error: "Missing/invalid date" },
      { status: 400 }
    );

  await prisma.habitLog
    .delete({ where: { habitId_date: { habitId: habit.id, date } } })
    .catch(() => {});
  return NextResponse.json({ deleted: true });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireUser();

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  if (dateParam) {
    const date = toUtcMidnight(dateParam);
    if (!date)
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    const log = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId: habit.id, date } },
      select: {
        id: true,
        date: true,
        status: true,
        note: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ exists: !!log, log });
  }

  let to = toParam ? toUtcMidnight(toParam) : null;
  let from = fromParam ? toUtcMidnight(fromParam) : null;
  if (!from || !to) {
    to = new Date();
    to.setUTCHours(0, 0, 0, 0);
    from = new Date(to);
    from.setUTCDate(to.getUTCDate() - 29);
  }

  const logs = await prisma.habitLog.findMany({
    where: { habitId: habit.id, date: { gte: from!, lte: to! } },
    select: { date: true, status: true, note: true },
    orderBy: { date: "asc" },
  });

  const series: { date: string; done: number }[] = [];
  const cursor = new Date(from!);
  while (cursor <= to!) {
    const key = `${cursor.getUTCFullYear()}-${String(
      cursor.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(cursor.getUTCDate()).padStart(2, "0")}`;
    const has = logs.some((l) => l.date.getTime() === cursor.getTime());
    series.push({ date: key, done: has ? 1 : 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return NextResponse.json({
    from: from!.toISOString(),
    to: to!.toISOString(),
    logs,
    series,
  });
}
