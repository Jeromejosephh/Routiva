// src/app/api/habits/[id]/logs/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { logCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const user = await requireUser();

  const pathname = req.nextUrl.pathname;
  const id = pathname.split("/api/habits/")[1]?.split("/")[0];
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const form = await req.formData();
  const data = Object.fromEntries(form) as Record<string, FormDataEntryValue>;

  const parsed = logCreate.safeParse({
    date: data.date?.toString(),
    status: data.status?.toString(),
    note: data.note ? data.note.toString() : undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
