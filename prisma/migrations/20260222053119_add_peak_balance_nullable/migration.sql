-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "isTrading" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "peakBalance" DOUBLE PRECISION;
