import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessageService } from './message.service';

@ApiTags('Messages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send message and get AI reply' })
  sendMessage(
    @Param('conversationId') conversationId: string,
    @GetUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messageService.sendMessage(conversationId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get full conversation history' })
  getHistory(
    @Param('conversationId') conversationId: string,
    @GetUser('id') userId: string,
  ) {
    return this.messageService.getHistory(conversationId, userId);
  }
}
