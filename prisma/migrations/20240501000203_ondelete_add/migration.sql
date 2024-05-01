-- DropForeignKey
ALTER TABLE "Chat_message" DROP CONSTRAINT "Chat_message_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "Chat_message" ADD CONSTRAINT "Chat_message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat_room"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;
