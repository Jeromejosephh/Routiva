// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

//for Server Components / Pages
export async function requireUser(redirectTo: string = "/dashboard") {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) redirect(`/sign-in?next=${encodeURIComponent(redirectTo)}`);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(redirectTo)}`);
  return user;
}

//for API route handlers
export async function requireUserApi() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id)
    return {
      user: null,
      res: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user)
    return {
      user: null,
      res: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };

  return { user, res: null as unknown as NextResponse };
}
