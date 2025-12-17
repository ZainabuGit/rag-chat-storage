import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiTags, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('sessions')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'favorite', required: false })
  findByUser(
    @Query('userId') userId: string,
    @Query('favorite') favorite?: string,
  ) {
    const isFavorite = favorite === undefined ? undefined : favorite === 'true';
    return this.sessionsService.findByUser(userId, isFavorite);
  }

  @Get(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  update(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 req / min
  async remove(@Param('id') id: string) {
    await this.sessionsService.remove(id);
    return { success: true };
  }
}
