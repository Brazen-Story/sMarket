/*
  Warnings:

  - Added the required column `reserve_price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "reserve_price" INTEGER NOT NULL;
