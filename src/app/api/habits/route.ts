// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { habitCreate } from "@/lib/validators";
import { requireUser } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  const user = await requireUser();

  const ct = req.headers.get("content-type") ?? "";
  let body: any;

  if (ct.includes("application/json")) {
    body = await req.json();
  } else if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    const fd = await req.formData();
    body = Object.fromEntries(fd);
    if (typeof body.targetDays === "string")
      body.targetDays = Number(body.targetDays);
  } else {
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 415 }
    );
  }

  const parsed = habitCreate.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(parsed.error.format(), { status: 400 });

  const row = await prisma.habit.create({
    data: { ...parsed.data, userId: user.id },
  });
  return NextResponse.json(row, { status: 201 });
}
