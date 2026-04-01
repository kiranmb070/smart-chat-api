import { Injectable } from '@nestjs/common';
import { Sessions } from 'src/auth/domain/model/session.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(session: Sessions): Promise<Sessions> {
    const sessionData = await this.prisma.session.create({
      data: {
        id: session.id,
        userId: session.userId,
        accestoken: session.accesToken,
        refreshToken: session.refreshToken,
        createdAt: session.createdAt,
        expireAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      },
    });
    return Sessions.ofExisting(sessionData);
  }
}
