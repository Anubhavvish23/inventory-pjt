/*
  Warnings:

  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add the description column as nullable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT;

-- Update existing records with a default description
UPDATE "Product" SET "description" = 'Product description' WHERE "description" IS NULL;

-- Now make the description column NOT NULL
ALTER TABLE "Product" ALTER COLUMN "description" SET NOT NULL;

-- Add the other optional columns
ALTER TABLE "Product" ADD COLUMN     "pickedBy" TEXT,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "serialNumber" TEXT;
