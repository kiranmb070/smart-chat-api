-- CreateTable
CREATE TABLE "token_limit" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_tokens" INTEGER NOT NULL DEFAULT 10,
    "used_tokens" INTEGER NOT NULL DEFAULT 0,
    "remaining_tokens" INTEGER NOT NULL DEFAULT 10,
    "reset_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_limit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_limit_user_id_key" ON "token_limit"("user_id");

-- AddForeignKey
ALTER TABLE "token_limit" ADD CONSTRAINT "token_limit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
