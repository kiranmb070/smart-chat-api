import { Injectable } from '@nestjs/common';
import { PrismaMessageRepository } from './infrastructure/repo/prisma-message.repositry';
import { AiService } from 'src/ai/ai.service';
import { MessageResponseDto } from './dtos/message-response.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from './domain/model/message.model';
import { ConversationService } from 'src/conversation/conversation.service';
import { AuthService } from 'src/auth/auth.service';
import { TokenTransactionService } from './token-transaction/token-transaction.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prismaMessageRepository: PrismaMessageRepository,
    private readonly conversationService: ConversationService,
    private readonly aiService: AiService,
    private readonly authService: AuthService,
    private readonly tokenTransactionService: TokenTransactionService,
  ) {}

  async sendMessage(
    conversationId: string,
    userId: string,
    dto: SendMessageDto,
  ) {
    // 1. verify conversation belongs to this user
    await this.conversationService.verifyOwnership(conversationId, userId);

    // 2. check token balance
    const tokenLimit = await this.authService
      .getProfile(userId)
      .then((profile) => profile.tokenLimit);

    console.log('User token limit:', tokenLimit);

    // if (!tokenLimit || tokenLimit.remainingTokens <= 0) {
    //   throw new HttpException(
    //     {
    //       statusCode: 429,
    //       message: 'Token limit exhausted. Try again next month.',
    //       remaining: 0,
    //     },
    //     HttpStatus.TOO_MANY_REQUESTS,
    //   );
    // }

    // 3. get current message count for orderIndex
    const count =
      await this.prismaMessageRepository.countByConversationId(conversationId);
    console.log('Current message count in conversation:', count);

    // 4. save user message
    const userMessage = Message.create({
      conversationId: conversationId,
      role: 'USER',
      content: dto.content,
      orderIndex: count + 1,
    });
    const savedUserMsg =
      await this.prismaMessageRepository.saveMessage(userMessage);

    console.log('Saved user message:', savedUserMsg);

    // 5. load full history for AI context
    const history =
      await this.prismaMessageRepository.getMessagesByConversationId(
        conversationId,
      );
    const aiMessages = history.map((m) => ({
      role: m.role.toLowerCase(),
      content: m.content,
    }));

    console.log('aimessage', aiMessages);

    // 6. call Ollama AI
    const aiResponse = await this.aiService.chat(aiMessages);
    console.log('Ollama replied ✅ tokens:', aiResponse.tokensUsed);

    // 7. save AI reply
    const aiMessage = Message.create({
      conversationId: conversationId,
      role: 'ASSISTANT',
      content: aiResponse.content,
      orderIndex: count + 2,
      tokensUsed: aiResponse.tokensUsed, // ← now it works!
    });
    const savedAiMsg =
      await this.prismaMessageRepository.saveMessage(aiMessage);

    console.log('ASSISTANT message saved ✅');
    console.log('Saving AI message:', aiMessage);

    // 8. deduct tokens from user balance
    await this.authService.updateTokenLimit(
      userId,
      tokenLimit.usedTokens,
      tokenLimit.remainingTokens,
      aiResponse.tokensUsed,
    );
    // 9. log token transaction

    await this.tokenTransactionService.createTokenTransaction({
      userId,
      conversationId,
      tokensUsed: aiResponse.tokensUsed,
      model: aiResponse.model,
      type: 'CHAT',
    });

    // 10. update conversation total tokens
    await this.conversationService.addTokens(
      conversationId,
      aiResponse.tokensUsed,
    );

    return {
      userMessage: MessageResponseDto.fromEntity(savedUserMsg),
      aiMessage: MessageResponseDto.fromEntity(savedAiMsg),
      tokensUsed: aiResponse.tokensUsed,
      remaining: tokenLimit.remainingTokens - aiResponse.tokensUsed,
    };
  }

  async getHistory(
    conversationId: string,
    userId: string,
  ): Promise<MessageResponseDto[]> {
    await this.conversationService.verifyOwnership(conversationId, userId);

    const messages =
      await this.prismaMessageRepository.getMessagesByConversationId(
        conversationId,
      );
    return messages.map((m) => MessageResponseDto.fromEntity(m));
  }
}
