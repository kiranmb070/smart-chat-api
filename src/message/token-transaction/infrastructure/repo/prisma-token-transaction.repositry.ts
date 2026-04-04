import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenTransaction } from '../../domain/model/token-transaction.model';
@Injectable()
export class PrismaTokenTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTokenTransaction(
    transaction: TokenTransaction,
  ): Promise<TokenTransaction> {
    const created = await this.prisma.tokenTransaction.create({
      data: {
        id: transaction.id,
        userId: transaction.userId,
        conversationId: transaction.conversationId,
        tokensUsed: transaction.tokensUsed,
        model: transaction.model,
        type: transaction.type,
        createdAt: transaction.createdAt,
      },
    });
    return TokenTransaction.ofExisting(created);
  }
}
