// src/app/api/habits/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

const patchSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    isArchived: z.boolean().optional(),
  })
  .strict();

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

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(parsed.error.format(), { status: 400 });
  if (!parsed.data.name && parsed.data.isArchived === undefined) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  const updated = await prisma.habit.update({
    where: { id: owned.id },
    data: parsed.data,
  });

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
