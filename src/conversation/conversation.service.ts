import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaConversationRepository } from './infrastructure/repo/prisma-conversation.repositry';
import { CreateConversationDto } from './dtos/conversation.dto';
import { ConversationResponesDto } from './dtos/conversation-respones.dto';
import { Conversation } from './domain/model/conversation.model';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: PrismaConversationRepository,
  ) {}

  async createConverstion(
    userId: string,
    dto: CreateConversationDto,
  ): Promise<ConversationResponesDto> {
    console.log('Creating conversation with title:', userId);
    const conversation = Conversation.create(userId, dto.title, dto.model);
    return this.conversationRepository.createConversation(conversation);
  }

  async finAll(userId: string): Promise<ConversationResponesDto[]> {
    const conversations =
      await this.conversationRepository.findAllByUserId(userId);
    return conversations.map((conv) =>
      ConversationResponesDto.fromConversation(conv),
    );
  }

  async findById(id: string): Promise<ConversationResponesDto> {
    const conversation = await this.conversationRepository.findById(id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return ConversationResponesDto.fromConversation(conversation);
  }
  async deleateConversation(id: string): Promise<void> {
    await this.conversationRepository.deleteConversation(id);
  }
  async addTokens(id: string, tokens: number): Promise<void> {
    const conversation = await this.conversationRepository.findById(id);
    if (!conversation) return;
    conversation.addTokens(tokens);
    await this.conversationRepository.updateConversation(conversation);
  }
  async verifyOwnership(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(id);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId !== userId)
      throw new ForbiddenException('Not your conversation');
    return conversation;
  }
}
