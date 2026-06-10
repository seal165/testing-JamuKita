-- CreateTable
CREATE TABLE `analytics_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventType` VARCHAR(50) NOT NULL,
    `eventData` TEXT NULL,
    `userId` INTEGER NULL,
    `sessionId` VARCHAR(255) NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `analytics_events_eventType_idx`(`eventType`),
    INDEX `analytics_events_createdAt_idx`(`createdAt`),
    INDEX `analytics_events_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
