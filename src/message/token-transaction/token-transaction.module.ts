import { Module } from '@nestjs/common';
import { TokenTransactionService } from './token-transaction.service';
import { PrismaTokenTransactionRepository } from './infrastructure/repo/prisma-token-transaction.repositry';

@Module({
  providers: [TokenTransactionService, PrismaTokenTransactionRepository],
  exports: [TokenTransactionService],
})
export class TokenTransactionModule {}
