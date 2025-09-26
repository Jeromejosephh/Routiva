// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { habitCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

export async function GET() {
  const user = await requireUser();
  const rows = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = habitCreate.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(parsed.error.format(), { status: 400 });
  const row = await prisma.habit.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json(row, { status: 201 });
}
