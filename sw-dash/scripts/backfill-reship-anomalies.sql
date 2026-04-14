-- Backfill reship anomaly flags for existing rows.
--
-- Run this ONCE after the 20260414000000_add_needs_admin_review migration
-- has been applied. It walks every cert with ftType='reship' and flags it
-- as needsAdminReview=true unless its most recent prior cert (same
-- ftProjectId) was approved, or was approved-then-returned-by-YSWS
-- (status='pending' with yswsReturnedAt set).
--
-- How to run:
--   mysql -u <user> -p <database> < scripts/backfill-reship-anomalies.sql
-- or paste into your MySQL client of choice.
--
-- Preview (safe) — see how many rows will be flagged before running:
--   SELECT COUNT(*) FROM ship_certs r
--   WHERE r.ftType = 'reship'
--     AND r.needsAdminReview = false
--     AND (
--       r.ftProjectId IS NULL
--       OR NOT EXISTS (
--         SELECT 1 FROM ship_certs p
--         WHERE p.ftProjectId = r.ftProjectId
--           AND p.id != r.id
--           AND NOT EXISTS (
--             SELECT 1 FROM ship_certs p2
--             WHERE p2.ftProjectId = r.ftProjectId
--               AND p2.id != r.id
--               AND (p2.createdAt, p2.id) > (p.createdAt, p.id)
--           )
--           AND (
--             p.status = 'approved'
--             OR (p.status = 'pending' AND p.yswsReturnedAt IS NOT NULL)
--           )
--       )
--     );

UPDATE `ship_certs` r
SET r.`needsAdminReview` = TRUE
WHERE r.`ftType` = 'reship'
  AND (
    r.`ftProjectId` IS NULL
    OR NOT EXISTS (
      SELECT 1 FROM `ship_certs` p
      WHERE p.`ftProjectId` = r.`ftProjectId`
        AND p.`id` != r.`id`
        AND NOT EXISTS (
          SELECT 1 FROM `ship_certs` p2
          WHERE p2.`ftProjectId` = r.`ftProjectId`
            AND p2.`id` != r.`id`
            AND (p2.`createdAt`, p2.`id`) > (p.`createdAt`, p.`id`)
        )
        AND (
          p.`status` = 'approved'
          OR (p.`status` = 'pending' AND p.`yswsReturnedAt` IS NOT NULL)
        )
    )
  );
