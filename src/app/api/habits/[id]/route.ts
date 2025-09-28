// src/app/api/habits/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  const owned = await prisma.habit.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, isArchived } = await req.json().catch(() => ({} as any));
  const data: Record<string, any> = {};
  if (typeof name === "string" && name.trim()) data.name = name.trim();
  if (typeof isArchived === "boolean") data.isArchived = isArchived;
  if (!Object.keys(data).length)
    return NextResponse.json({ error: "No changes" }, { status: 400 });

  const updated = await prisma.habit.update({ where: { id: owned.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  const owned = await prisma.habit.findFirst({
    where: { id: params.id, userId: user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.habit.delete({ where: { id: owned.id } });
  return NextResponse.json({ ok: true });
}
