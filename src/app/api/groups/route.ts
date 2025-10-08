import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required").max(50),
  color: z.string().min(1, "Color is required"),
  icon: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groups = await (prisma as any).habitGroup.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { habits: true }
        }
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Failed to get groups:", error);
    return NextResponse.json({ error: "Failed to get groups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    
    const parsed = createGroupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Check for duplicate name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma as any).habitGroup.findFirst({
      where: { userId: user.id, name: parsed.data.name }
    });

    if (existing) {
      return NextResponse.json({ error: "Group name already exists" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const group = await (prisma as any).habitGroup.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        color: parsed.data.color,
        icon: parsed.data.icon,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Failed to create group:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}