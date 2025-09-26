// src/app/api/habits/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

type Candidate = { date: unknown; status: unknown; note?: unknown };

function formToCandidate(fd: FormData): Candidate {
  return {
    date: String(fd.get("date") ?? ""),
    status: String(fd.get("status") ?? ""),
    note: fd.get("note") ?? undefined,
  };
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  const ct = req.headers.get("content-type") ?? "";

  let candidate: unknown;
  if (ct.includes("application/json")) {
    candidate = await req.json();
  } else {
    const fd = await req.formData();
    candidate = formToCandidate(fd);
  }

  const parsed = logCreate.safeParse(candidate);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // parsed.data.date is a Date (thanks to z.coerce.date)
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

  return NextResponse.json(log, { status: 201 });
}
