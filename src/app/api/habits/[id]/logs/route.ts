// src/app/api/habits/[id]/logs/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

function redirectIfNavigation(req: NextRequest) {
  const mode = req.headers.get("sec-fetch-mode");
  const accept = req.headers.get("accept") || "";
  return mode === "navigate" || accept.includes("text/html");
}

function toUtcMidnight(s: string) {
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const match = new URL(req.url).pathname.match(/\/api\/habits\/([^/]+)\/logs/);
  const habitId = match?.[1];
  if (!habitId)
    return NextResponse.json({ error: "Invalid habit id" }, { status: 400 });

  const ct = req.headers.get("content-type") ?? "";
  let candidate: unknown;
  if (ct.includes("application/json")) {
    candidate = await req.json();
  } else {
    const fd = await req.formData();
    candidate = {
      date: fd.get("date"),
      status: fd.get("status"),
      note: fd.get("note") ?? undefined,
    };
  }

  const parsed = logCreate.safeParse(candidate);
  if (!parsed.success)
    return NextResponse.json(parsed.error.format(), { status: 400 });

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const date = new Date(parsed.data.date);
  date.setUTCHours(0, 0, 0, 0);

  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: habit.id, date } },
    update: { status: parsed.data.status, note: parsed.data.note },
    create: {
      habitId: habit.id,
      date,
      status: parsed.data.status,
      note: parsed.data.note,
    },
  });

  if (redirectIfNavigation(req))
    return NextResponse.redirect(new URL("/habits", req.url), 303);
  return NextResponse.json(log, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  const url = new URL(req.url);
  const match = url.pathname.match(/\/api\/habits\/([^/]+)\/logs/);
  const habitId = match?.[1];
  if (!habitId)
    return NextResponse.json({ error: "Invalid habit id" }, { status: 400 });

  const dateParam = url.searchParams.get("date");
  if (!dateParam)
    return NextResponse.json({ error: "Missing date" }, { status: 400 });

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
    select: { id: true },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const date = new Date(dateParam);
  date.setUTCHours(0, 0, 0, 0);

  await prisma.habitLog
    .delete({ where: { habitId_date: { habitId: habit.id, date } } })
    .catch(() => {});

  if (redirectIfNavigation(req))
    return NextResponse.redirect(new URL("/habits", req.url), 303);
  return NextResponse.json({ deleted: true }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  const url = new URL(req.url);
  const match = url.pathname.match(/\/api\/habits\/([^/]+)\/logs/);
  const habitId = match?.[1];
  if (!habitId)
    return NextResponse.json({ error: "Invalid habit id" }, { status: 400 });

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
    select: { id: true },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const dateParam = url.searchParams.get("date");
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  if (dateParam) {
    const date = toUtcMidnight(dateParam);
    if (!date)
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });

    const log = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId, date } },
      select: {
        id: true,
        date: true,
        status: true,
        note: true,
        createdAt: true,
      },
    });

    if (redirectIfNavigation(req))
      return NextResponse.redirect(new URL("/habits", req.url), 303);
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
    where: { habitId, date: { gte: from!, lte: to! } },
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
    cursor.setUTCDate(cursor.getUTCDate() - 0 + 1);
  }

  if (redirectIfNavigation(req))
    return NextResponse.redirect(new URL("/habits", req.url), 303);
  return NextResponse.json({
    from: from!.toISOString(),
    to: to!.toISOString(),
    logs,
    series,
  });
}
