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
