-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_price" INTEGER NOT NULL,
    "hammer_price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Product_image" (
    "image_id" TEXT NOT NULL,
    "image_1" TEXT NOT NULL,
    "image_2" TEXT NOT NULL,
    "image_3" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Product_image_pkey" PRIMARY KEY ("image_id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_image" ADD CONSTRAINT "Product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
