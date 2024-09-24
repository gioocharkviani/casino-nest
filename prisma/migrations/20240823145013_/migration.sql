/*
  Warnings:

  - You are about to drop the `notificontent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notificontent` DROP FOREIGN KEY `Notificontent_notificationId_fkey`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `content` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `notificontent`;
