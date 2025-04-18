/*
  Warnings:

  - You are about to drop the column `accessNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipient_last_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipient_name` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "accessNumber",
DROP COLUMN "bank",
DROP COLUMN "password",
DROP COLUMN "timestamp",
DROP COLUMN "userId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "order_number" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "receipient_last_name" TEXT NOT NULL,
ADD COLUMN     "receipient_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "accessNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);
