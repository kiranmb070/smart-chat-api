import { v4 as uuidv4 } from 'uuid';

export class TokenLimit {
  constructor(
    public id: string,
    public userId: string,
    public totalTokens: number,
    public usedTokens: number,
    public remainingTokens: number,
    public resetAt: Date,
    public updatedAt: Date,
  ) {}

  static create(details: { userId: string }): TokenLimit {
    const now = new Date();
    return new TokenLimit(
      uuidv4(),
      details.userId,
      10,
      0,
      10,
      new Date(now.getTime() + 24 * 60 * 60 * 1000),
      new Date(),
    );
  }

  static ofExisting(data: {
    id: string;
    userId: string;
    totalTokens: number;
    usedTokens: number;
    remainingTokens: number;
    resetAt: Date;
    updatedAt: Date;
  }): TokenLimit {
    const remainingTokens = data.totalTokens - data.usedTokens;
    return new TokenLimit(
      data.id,
      data.userId,
      data.totalTokens,
      data.usedTokens,
      remainingTokens,
      data.resetAt,
      data.updatedAt,
    );
  }
}
