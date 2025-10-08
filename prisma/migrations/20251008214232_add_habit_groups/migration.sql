/*
  Warnings:

  - You are about to drop the column `targetDays` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the `HabitTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Habit` will be added. If there are existing duplicate values, this will fail.
  - Made the column `color` on table `Habit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."HabitTag" DROP CONSTRAINT "HabitTag_habitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HabitTag" DROP CONSTRAINT "HabitTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropIndex
DROP INDEX "public"."Habit_userId_idx";

-- AlterTable
ALTER TABLE "public"."Habit" DROP COLUMN "targetDays",
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "timeOfDay" TEXT,
ADD COLUMN     "weeklyTarget" INTEGER NOT NULL DEFAULT 4,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT 'gray';

-- AlterTable
ALTER TABLE "public"."HabitLog" ALTER COLUMN "status" SET DEFAULT 'done';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "reminderDailyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderDailyTime" TEXT,
ADD COLUMN     "summaryWeeklyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "theme" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- DropTable
DROP TABLE "public"."HabitTag";

-- DropTable
DROP TABLE "public"."Tag";

-- CreateTable
CREATE TABLE "public"."HabitGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HabitGroup_userId_order_idx" ON "public"."HabitGroup"("userId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "HabitGroup_userId_name_key" ON "public"."HabitGroup"("userId", "name");

-- CreateIndex
CREATE INDEX "Habit_userId_isArchived_idx" ON "public"."Habit"("userId", "isArchived");

-- CreateIndex
CREATE INDEX "Habit_userId_groupId_idx" ON "public"."Habit"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Habit_userId_name_key" ON "public"."Habit"("userId", "name");

-- AddForeignKey
ALTER TABLE "public"."Habit" ADD CONSTRAINT "Habit_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."HabitGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitGroup" ADD CONSTRAINT "HabitGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
