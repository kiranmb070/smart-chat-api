import { HttpException, HttpStatus } from '@nestjs/common';

export class ConversationNotFoundException extends HttpException {
  constructor(id: string) {
    super(
      {
        message: `Conversation with ID ${id} not found`,
        errorCode: 'CONVERSATION_NOT_FOUND',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
