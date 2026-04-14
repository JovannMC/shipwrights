-- AlterTable
ALTER TABLE `ship_certs`
  ADD COLUMN `needsAdminReview` BOOLEAN NOT NULL DEFAULT false;
