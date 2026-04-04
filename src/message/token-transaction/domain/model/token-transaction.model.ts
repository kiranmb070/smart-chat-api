import { TransactionType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class TokenTransaction {
  constructor(
    public id: string,
    public userId: string,
    public conversationId: string,
    public tokensUsed: number,
    public model: string,
    public type: TransactionType,
    public createdAt: Date,
  ) {}

  static create(details: {
    userId: string;
    conversationId: string;
    tokensUsed: number;
    model: string;
    type: TransactionType;
  }): TokenTransaction {
    return new TokenTransaction(
      uuidv4(),
      details.userId,
      details.conversationId,
      details.tokensUsed,
      details.model,
      details.type,
      new Date(),
    );
  }

  static ofExisting(data: {
    id: string;
    userId: string;
    conversationId: string;
    tokensUsed: number;
    model: string;
    type: TransactionType;
    createdAt: Date;
  }): TokenTransaction {
    return new TokenTransaction(
      data.id,
      data.userId,
      data.conversationId,
      data.tokensUsed,
      data.model,
      data.type,
      data.createdAt,
    );
  }
}
