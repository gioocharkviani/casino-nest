/*
  Warnings:

  - Made the column `trigerAt` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `trigerAt` DATETIME(3) NOT NULL;
