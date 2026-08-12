/*
  Warnings:

  - You are about to drop the column `timeZone` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Recife';
