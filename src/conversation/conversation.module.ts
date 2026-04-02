import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { PrismaConversationRepository } from './infrastructure/repo/prisma-conversation.repositry';

@Module({
  providers: [ConversationService, PrismaConversationRepository],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
