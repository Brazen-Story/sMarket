-- CreateTable
CREATE TABLE "Review" (
    "review_id" TEXT NOT NULL,
    "coment" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Review_Good_coment" (
    "good_id" TEXT NOT NULL,
    "coment" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,

    CONSTRAINT "Review_Good_coment_pkey" PRIMARY KEY ("good_id")
);

-- CreateTable
CREATE TABLE "Review_Bad_coment" (
    "bad_id" TEXT NOT NULL,
    "coment" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,

    CONSTRAINT "Review_Bad_coment_pkey" PRIMARY KEY ("bad_id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review_Good_coment" ADD CONSTRAINT "Review_Good_coment_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Review"("review_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review_Bad_coment" ADD CONSTRAINT "Review_Bad_coment_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Review"("review_id") ON DELETE RESTRICT ON UPDATE CASCADE;
