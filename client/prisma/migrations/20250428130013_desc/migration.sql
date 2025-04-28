/*
  Warnings:

  - Added the required column `description` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foundedYear` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyLeader` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyNumber` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "foundedYear" TEXT NOT NULL,
ADD COLUMN     "partyLeader" TEXT NOT NULL,
ADD COLUMN     "partyNumber" TEXT NOT NULL;
