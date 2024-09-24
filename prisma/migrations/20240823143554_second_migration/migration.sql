/*
  Warnings:

  - You are about to alter the column `category` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `notification` ADD COLUMN `trigerAt` DATETIME(3) NULL,
    MODIFY `category` ENUM('NOTIFI', 'POPUP') NOT NULL DEFAULT 'NOTIFI';
