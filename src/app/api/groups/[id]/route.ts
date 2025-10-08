import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

const updateGroupSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();
    const body = await req.json();
    
    const parsed = updateGroupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Check ownership
    const group = await prisma.habitGroup.findFirst({
      where: { id, userId: user.id }
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check for duplicate name if updating name
    if (parsed.data.name && parsed.data.name !== group.name) {
      const existing = await prisma.habitGroup.findFirst({
        where: { userId: user.id, name: parsed.data.name, id: { not: id } }
      });

      if (existing) {
        return NextResponse.json({ error: "Group name already exists" }, { status: 400 });
      }
    }

    const updated = await prisma.habitGroup.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update group:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireUser();

    // Check ownership and if group has habits
    const group = await prisma.habitGroup.findFirst({
      where: { id, userId: user.id },
      include: { _count: { select: { habits: true } } }
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group._count.habits > 0) {
      return NextResponse.json({ error: "Cannot delete group with habits" }, { status: 400 });
    }

    await prisma.habitGroup.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete group:", error);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}