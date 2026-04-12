/*
  Warnings:

  - You are about to drop the column `etag` on the `UploadSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UploadSession` table. All the data in the column will be lost.
  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `masterPlaylistKey` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `TranscodeJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoRendition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `videoChannel` to the `Video` table without a default value. This is not possible if the table is not empty.
  - The required column `videoId` was added to the `Video` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "TranscodeJob" DROP CONSTRAINT "TranscodeJob_videoId_fkey";

-- DropForeignKey
ALTER TABLE "UploadSession" DROP CONSTRAINT "UploadSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "UploadSession" DROP CONSTRAINT "UploadSession_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoRendition" DROP CONSTRAINT "VideoRendition_videoId_fkey";

-- DropIndex
DROP INDEX "UploadSession_userId_createdAt_idx";

-- DropIndex
DROP INDEX "Video_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "UploadSession" DROP COLUMN "etag",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "id",
DROP COLUMN "masterPlaylistKey",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "visibility",
ADD COLUMN     "videoChannel" TEXT NOT NULL,
ADD COLUMN     "videoId" TEXT NOT NULL,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("videoId");

-- DropTable
DROP TABLE "TranscodeJob";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VideoRendition";

-- DropEnum
DROP TYPE "TranscodeJobState";

-- DropEnum
DROP TYPE "VideoRenditionStatus";

-- DropEnum
DROP TYPE "VideoVisibility";

-- CreateIndex
CREATE INDEX "UploadSession_videoId_createdAt_idx" ON "UploadSession"("videoId", "createdAt");

-- CreateIndex
CREATE INDEX "Video_videoChannel_createdAt_idx" ON "Video"("videoChannel", "createdAt");

-- AddForeignKey
ALTER TABLE "UploadSession" ADD CONSTRAINT "UploadSession_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("videoId") ON DELETE CASCADE ON UPDATE CASCADE;
