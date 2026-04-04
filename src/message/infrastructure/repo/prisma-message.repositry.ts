import { Injectable } from '@nestjs/common';
import { Message } from 'src/message/domain/model/message.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(message: Message): Promise<Message> {
    const messageData = await this.prisma.message.create({
      data: {
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        tokensUsed: message.tokensUsed,
        orderIndex: message.orderIndex,
        createdAt: message.createdAt,
      },
    });
    return Message.ofExisting(messageData);
  }

  async getMessagesByConversationId(
    conversationId: string,
  ): Promise<Message[]> {
    const messagesData = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { orderIndex: 'asc' },
    });
    return messagesData.map((data) => Message.ofExisting(data));
  }

  async countByConversationId(conversationId: string): Promise<number> {
    return this.prisma.message.count({
      where: { conversationId },
    });
  }
}
