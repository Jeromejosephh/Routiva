// src/app/api/habits/[id]/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { rateLimitRequest } from "@/lib/rate-limit";
import { logCreate } from "@/lib/validators";
import { logger } from "@/lib/logger";

function getRequestIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  return real ?? "unknown";
}

function toUtcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

export async function POST(
  req: NextRequest,
  ctx: { params: Record<string, string> }
) {
  const user = await requireUser();

  // Your helper expects only the request
  await rateLimitRequest(req);

  const ip = getRequestIp(req);
  const habitId = ctx.params.id;

  // Verify ownership
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
    select: { id: true },
  });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Parse body safely (JSON or multipart/form-data)
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

  // Normalise date
  const dateInput =
    parsed.date instanceof Date ? parsed.date : new Date(String(parsed.date));
  const dateUtc = toUtcMidnight(dateInput);

  // Upsert by (habitId, date)
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
}
