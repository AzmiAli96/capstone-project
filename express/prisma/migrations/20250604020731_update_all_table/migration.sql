/*
  Warnings:

  - A unique constraint covering the columns `[no_spb]` on the table `Pengiriman` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prioritas` to the `Pengiriman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengiriman" ADD COLUMN     "no_spb" VARCHAR(10),
ADD COLUMN     "prioritas" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pengiriman_no_spb_key" ON "Pengiriman"("no_spb");
