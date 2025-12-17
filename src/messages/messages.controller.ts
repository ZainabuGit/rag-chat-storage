import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('messages')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('sessions/:sessionId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  create(@Param('sessionId') sessionId: string, @Body() dto: CreateMessageDto) {
    return this.messagesService.create(sessionId, dto);
  }

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  findBySession(
    @Param('sessionId') sessionId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.messagesService.findBySession(
      sessionId,
      Number(page),
      Number(limit),
    );
  }
}
