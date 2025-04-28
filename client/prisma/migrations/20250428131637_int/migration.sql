/*
  Warnings:

  - Changed the type of `partyNumber` on the `Party` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Party" DROP COLUMN "partyNumber",
ADD COLUMN     "partyNumber" INTEGER NOT NULL;
