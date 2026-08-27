-- Add the selector required by the refresh-token rotation flow.
ALTER TABLE "RefreshToken" ADD COLUMN "selector" TEXT;

-- Existing refresh tokens predate selector-based rotation and cannot be
-- presented by clients, but must remain valid rows during the migration.
UPDATE "RefreshToken"
SET "selector" = md5("id" || random()::text || clock_timestamp()::text)
WHERE "selector" IS NULL;

ALTER TABLE "RefreshToken" ALTER COLUMN "selector" SET NOT NULL;

CREATE UNIQUE INDEX "RefreshToken_selector_key" ON "RefreshToken"("selector");
DROP INDEX IF EXISTS "RefreshToken_tokenHash_key";