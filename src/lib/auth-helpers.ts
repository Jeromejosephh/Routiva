// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) throw new Error("UNAUTHORIZED");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("UNAUTHORIZED");

  return user;
}
