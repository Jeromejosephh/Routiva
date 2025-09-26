// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserApi } from "@/lib/auth-helpers";

export async function GET() {
  const { user, res } = await requireUserApi();
  if (!user) return res; // 401 JSON

  const rows = await prisma.habit.findMany({
    where: { userId: user.id, isArchived: false },
  });
  return NextResponse.json(rows);
}
