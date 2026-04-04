import { MessageRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
export class Message {
  constructor(
    public id: string,
    public conversationId: string,
    public role: MessageRole,
    public content: string,
    public tokensUsed: number,
    public orderIndex: number,
    public createdAt: Date,
  ) {}

  static create(details: {
    conversationId: string;
    role: MessageRole;
    content: string;
    orderIndex: number;
    tokensUsed?: number;
  }): Message {
    return new Message(
      uuidv4(),
      details.conversationId,
      details.role,
      details.content,
      details.tokensUsed ?? 0,
      details.orderIndex,
      new Date(),
    );
  }

  static ofExisting(data: {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    tokensUsed: number;
    orderIndex: number;
    createdAt: Date;
  }): Message {
    return new Message(
      data.id,
      data.conversationId,
      data.role,
      data.content,
      data.tokensUsed,
      data.orderIndex,
      data.createdAt,
    );
  }
}
