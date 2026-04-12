/*
  Warnings:

  - Made the column `title` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `durationSeconds` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "durationSeconds" SET NOT NULL;
