import { Injectable } from '@nestjs/common';
import { TokenLimit } from 'src/auth/domain/model/token-limit.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenLimitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async tokenCreate(tokenlimit: TokenLimit): Promise<TokenLimit> {
    const createdTokenLimit = await this.prisma.tokenLimit.create({
      data: {
        id: tokenlimit.id,
        userId: tokenlimit.userId,
        usedTokens: tokenlimit.usedTokens,
        remainingTokens: tokenlimit.remainingTokens,
        resetAt: tokenlimit.resetAt,
        updatedAt: tokenlimit.updatedAt,
      },
    });
    return TokenLimit.ofExisting(createdTokenLimit);
  }

  async findByUserId(userId: string): Promise<TokenLimit | null> {
    const tokenLimitData = await this.prisma.tokenLimit.findUnique({
      where: { userId },
    });
    if (!tokenLimitData) {
      return null;
    }
    return TokenLimit.ofExisting(tokenLimitData);
  }
}
