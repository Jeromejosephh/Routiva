// src/app/api/habits/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  const body = await req.formData();
  const data = Object.fromEntries(body) as any;
  const parsed = logCreate.safeParse({
    date: data.date,
    status: data.status,
    note: data.note,
  });
  if (!parsed.success)
    return NextResponse.json(parsed.error.format(), { status: 400 });

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId: user.id },
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

  return NextResponse.json(log, { status: 201 });
}
