// src/app/api/user/delete/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function DELETE() {
  try {
    const user = await requireUser();

    // Use transaction to ensure all data is deleted properly
    await prisma.$transaction(async (tx) => {
      // Delete all habit logs first (they reference habits)
      await tx.habitLog.deleteMany({
        where: {
          habit: {
            userId: user.id
          }
        }
      });

      // Delete all habits
      await tx.habit.deleteMany({
        where: {
          userId: user.id
        }
      });

      // Delete all habit groups
      await tx.habitGroup.deleteMany({
        where: {
          userId: user.id
        }
      });

      // Delete all sessions
      await tx.session.deleteMany({
        where: {
          userId: user.id
        }
      });

      // Delete all accounts (OAuth connections)
      await tx.account.deleteMany({
        where: {
          userId: user.id
        }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: {
          id: user.id
        }
      });
    });

    return NextResponse.json(
      { message: 'Account successfully deleted' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    );
  }
}