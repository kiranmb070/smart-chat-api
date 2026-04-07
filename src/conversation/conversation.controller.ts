import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CreateConversationDto } from './dtos/conversation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new conversation' })
  @UseGuards(JwtAuthGuard)
  async createConversation(
    @GetUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return await this.conversationService.createConverstion(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my conversations' })
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser('id') userId: string) {
    return this.conversationService.finAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one conversation by id' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.conversationService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete conversation' })
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.conversationService.deleateConversation(id);
  }
}
