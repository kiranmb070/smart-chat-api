import { Injectable } from '@nestjs/common';
import { PrismaTokenTransactionRepository } from './infrastructure/repo/prisma-token-transaction.repositry';
import { TokenTransactionDto } from './dtos/token-transaction.dto';
import { TokenTransaction } from './domain/model/token-transaction.model';

@Injectable()
export class TokenTransactionService {
  constructor(
    private readonly prismaTokenTransactionRepository: PrismaTokenTransactionRepository,
  ) {}

  async createTokenTransaction(dto: TokenTransactionDto) {
    const { userId, conversationId, tokensUsed, model, type } = dto;
    const transaction = TokenTransaction.create({
      userId,
      conversationId,
      tokensUsed,
      model,
      type,
    });
    await this.prismaTokenTransactionRepository.createTokenTransaction(
      transaction,
    );
  }
}
