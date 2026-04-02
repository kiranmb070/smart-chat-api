import { Conversation } from '../domain/model/conversation.model';

export class ConversationResponesDto {
  id: string;
  userId: string;
  title: string;
  model: string;
  totalTokensUsed: number;
  createdAt: Date;
  updatedAt: Date;

  static fromConversation(e: Conversation): ConversationResponesDto {
    const dto = new ConversationResponesDto();
    dto.id = e.id;
    dto.userId = e.userId;
    dto.title = e.title;
    dto.model = e.model;
    dto.totalTokensUsed = e.totalTokensUsed;
    dto.createdAt = e.createdAt;
    dto.updatedAt = e.updatedAt;
    return dto;
  }
}
