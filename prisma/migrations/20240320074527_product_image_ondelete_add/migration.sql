-- DropForeignKey
ALTER TABLE "Product_image" DROP CONSTRAINT "Product_image_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Product_image" ADD CONSTRAINT "Product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
