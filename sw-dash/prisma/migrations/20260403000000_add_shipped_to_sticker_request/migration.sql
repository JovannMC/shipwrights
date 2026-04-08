ALTER TABLE `sticker_requests` ADD COLUMN `shipped` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `sticker_requests` ADD COLUMN `shippedAt` DATETIME(3) NULL;
