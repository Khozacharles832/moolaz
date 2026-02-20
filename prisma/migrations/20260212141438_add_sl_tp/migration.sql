/*
  Warnings:

  - Added the required column `stopLoss` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takeProfit` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "stopLoss" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "takeProfit" DOUBLE PRECISION NOT NULL;
