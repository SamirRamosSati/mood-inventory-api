/*
  Warnings:

  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[initials]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."StockMovement" DROP CONSTRAINT "StockMovement_staffId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "initials" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "public"."Staff";

-- CreateIndex
CREATE UNIQUE INDEX "User_initials_key" ON "public"."User"("initials");

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
