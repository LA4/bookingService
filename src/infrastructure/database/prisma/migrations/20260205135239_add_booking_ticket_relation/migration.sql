/*
  Warnings:

  - You are about to drop the column `seatId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatId` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seatId",
ADD COLUMN     "seatIds" TEXT[];

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "seatId",
ADD COLUMN     "seatIds" TEXT[];

-- CreateIndex
CREATE INDEX "Ticket_bookingId_idx" ON "Ticket"("bookingId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
