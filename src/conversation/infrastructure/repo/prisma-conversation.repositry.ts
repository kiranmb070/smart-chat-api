import { Injectable } from '@nestjs/common';
import { ConversationNotFoundException } from 'src/conversation/domain/exceptions/conversation-not-found.exception';
import { Conversation } from 'src/conversation/domain/model/conversation.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(conversation: Conversation): Promise<Conversation> {
    const conversationData = await this.prisma.conversation.create({
      data: {
        id: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        model: conversation.model,
        totalTokensUsed: conversation.totalTokensUsed,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
    return Conversation.ofExisting(conversationData);
  }

  async findById(id: string): Promise<Conversation | null> {
    if (!id) {
      throw new ConversationNotFoundException(id);
    }
    const data = await this.prisma.conversation.findUnique({
      where: { id },
    });
    return data ? Conversation.ofExisting(data) : null;
  }

  async findAllByUserId(userId: string): Promise<Conversation[]> {
    const data = await this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return data.map((item) => Conversation.ofExisting(item));
  }

  async updateConversation(conversation: Conversation): Promise<Conversation> {
    if (!conversation.id) {
      throw new ConversationNotFoundException(conversation.id);
    }
    const updatedData = await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title,
        totalTokensUsed: conversation.totalTokensUsed,
        updatedAt: new Date(),
      },
    });
    return Conversation.ofExisting(updatedData);
  }

  async deleteConversation(id: string): Promise<void> {
    if (!id) {
      throw new ConversationNotFoundException(id);
    }

    const isConversationAssociatedWithMessages =
      await this.prisma.message.findFirst({
        where: { conversationId: id },
      });

    if (isConversationAssociatedWithMessages) {
      throw new ConversationNotFoundException(id);
    }

    await this.prisma.conversation.delete({
      where: { id },
    });
  }
}
