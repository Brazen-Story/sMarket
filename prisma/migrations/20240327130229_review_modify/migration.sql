/*
  Warnings:

  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "user_id",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
