/*
  Warnings:

  - Added the required column `product_id` to the `Chat_room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat_room" ADD COLUMN     "chatTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat_room" ADD CONSTRAINT "Chat_room_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
