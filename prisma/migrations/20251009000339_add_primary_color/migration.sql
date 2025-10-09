-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "primaryColor" TEXT NOT NULL DEFAULT 'blue',
ALTER COLUMN "theme" SET DEFAULT 'light';
