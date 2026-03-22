-- CreateTable
CREATE TABLE `sticker_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ftProjectId` VARCHAR(191) NOT NULL,
    `requestedBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sticker_requests_requestedBy_idx`(`requestedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sticker_requests` ADD CONSTRAINT `sticker_requests_requestedBy_fkey` FOREIGN KEY (`requestedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
