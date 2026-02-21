import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function DELETE() {
  try {
    const user = await requireUser();

    await prisma.$transaction(async (tx) => {
      await tx.habitLog.deleteMany({ where: { habit: { userId: user.id } } });
      await tx.habit.deleteMany({ where: { userId: user.id } });
      await tx.habitGroup.deleteMany({ where: { userId: user.id } });
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.account.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    });

    return NextResponse.json(
      { message: 'Account successfully deleted' },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Account deletion error', { error: error instanceof Error ? error : new Error(String(error)) });
    return NextResponse.json(
      { error: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    );
  }
}