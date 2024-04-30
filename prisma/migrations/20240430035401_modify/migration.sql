-- DropForeignKey
ALTER TABLE "Chat_room" DROP CONSTRAINT "Chat_room_buyer_id_fkey";

-- AddForeignKey
ALTER TABLE "Chat_room" ADD CONSTRAINT "Chat_room_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
