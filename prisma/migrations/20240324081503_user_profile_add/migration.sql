-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biography" TEXT;

-- CreateTable
CREATE TABLE "User_image" (
    "image_id" TEXT NOT NULL,
    "profile_image" TEXT,
    "background_image" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "User_image_pkey" PRIMARY KEY ("image_id")
);

-- AddForeignKey
ALTER TABLE "User_image" ADD CONSTRAINT "User_image_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
