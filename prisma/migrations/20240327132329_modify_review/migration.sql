/*
  Warnings:

  - You are about to drop the `Review_Bad_coment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review_Good_coment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review_Bad_coment" DROP CONSTRAINT "Review_Bad_coment_review_id_fkey";

-- DropForeignKey
ALTER TABLE "Review_Good_coment" DROP CONSTRAINT "Review_Good_coment_review_id_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Review_Bad_coment";

-- DropTable
DROP TABLE "Review_Good_coment";
