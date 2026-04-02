-- CreateIndex
CREATE INDEX "conversations_user_id_idx" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_order_index_idx" ON "messages"("conversation_id", "order_index");

-- CreateIndex
CREATE INDEX "token_transactions_user_id_created_at_idx" ON "token_transactions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "token_transactions_conversation_id_idx" ON "token_transactions"("conversation_id");
