import { TransactionType } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TokenTransactionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsNumber()
  @IsNotEmpty()
  tokensUsed: number;

  @IsString()
  @IsNotEmpty()
  model: string;

  type: TransactionType;
}
