// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { habitCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

type HabitInput = z.infer<typeof habitCreate>;

function formToHabitInput(fd: FormData): HabitInput {
  const name = String(fd.get("name") ?? "");
  const description = fd.get("description");
  const targetDaysRaw = fd.get("targetDays");
  return {
    name,
    description: typeof description === "string" ? description : undefined,
    targetDays:
      typeof targetDaysRaw === "string" && targetDaysRaw !== ""
        ? Number(targetDaysRaw)
        : undefined,
  };
}

export async function POST(req: Request) {
  const user = await requireUser();
  const ct = req.headers.get("content-type") ?? "";

  let candidate: unknown;
  if (ct.includes("application/json")) {
    candidate = await req.json();
  } else if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    const fd = await req.formData();
    candidate = formToHabitInput(fd);
  } else {
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 415 }
    );
  }

  const parsed = habitCreate.safeParse(candidate);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }

  const row = await prisma.habit.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json(row, { status: 201 });
}
