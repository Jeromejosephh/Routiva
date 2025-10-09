import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  primaryColor: z.enum(['blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'teal', 'indigo', 'cyan', 'emerald', 'lime', 'amber', 'rose', 'violet', 'sky']).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    
    const parsed = updatePreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(parsed.data.theme && { theme: parsed.data.theme }),
        ...(parsed.data.primaryColor && { primaryColor: parsed.data.primaryColor }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}