import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaMessageRepository } from './infrastructure/repo/prisma-message.repositry';
import { ConversationModule } from 'src/conversation/conversation.module';
import { AiModule } from 'src/ai/ai.module';
import { TokenTransactionModule } from './token-transaction/token-transaction.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [ConversationModule, AiModule, TokenTransactionModule, AuthModule],
  providers: [MessageService, PrismaMessageRepository],
  controllers: [MessageController],
})
export class MessageModule {}
