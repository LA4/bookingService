/*
  Warnings:

  - Added the required column `userId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_showtimeId_idx";

-- DropIndex
DROP INDEX "Booking_userId_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "seatId" TEXT[];

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "userId" TEXT NOT NULL;
