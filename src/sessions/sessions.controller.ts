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
// import { Throttle } from '@nestjs/throttler';

@ApiTags('sessions')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  // @Throttle(20, 60)
  create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Get()
  // @Throttle(50, 60)
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
  // @Throttle(50, 60)
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  // @Throttle(20, 60)
  update(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @Delete(':id')
  // @Throttle(20, 60)
  async remove(@Param('id') id: string) {
    await this.sessionsService.remove(id);
    return { success: true };
  }
}
