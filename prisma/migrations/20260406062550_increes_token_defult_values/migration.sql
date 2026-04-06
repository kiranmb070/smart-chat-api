-- AlterTable
ALTER TABLE "token_limit" ALTER COLUMN "total_tokens" SET DEFAULT 100000,
ALTER COLUMN "remaining_tokens" SET DEFAULT 100000;
