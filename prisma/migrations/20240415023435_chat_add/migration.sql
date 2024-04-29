-- CreateTable
CREATE TABLE "Chat_room" (
    "chat_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,

    CONSTRAINT "Chat_room_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "Chat_message" (
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sendTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_message_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "Chat_room" ADD CONSTRAINT "Chat_room_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_room" ADD CONSTRAINT "Chat_room_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_message" ADD CONSTRAINT "Chat_message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat_message" ADD CONSTRAINT "Chat_message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat_room"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
