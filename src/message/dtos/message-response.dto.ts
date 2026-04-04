import { Message } from '../domain/model/message.model';

export class MessageResponseDto {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  tokensUsed: number;
  orderIndex: number;
  createdAt: Date;

  static fromEntity(e: Message): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.id = e.id;
    dto.conversationId = e.conversationId;
    dto.role = e.role;
    dto.content = e.content;
    dto.tokensUsed = e.tokensUsed;
    dto.orderIndex = e.orderIndex;
    dto.createdAt = e.createdAt;
    return dto;
  }
}
