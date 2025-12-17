import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSession } from '../sessions/entities/chat-session.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly msgRepo: Repository<ChatMessage>,
    @InjectRepository(ChatSession)
    private readonly sessionRepo: Repository<ChatSession>,
  ) {}

  async create(
    sessionId: string,
    dto: CreateMessageDto,
  ): Promise<ChatMessage> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const message = this.msgRepo.create({
      sessionId,
      session,
      role: dto.role,
      content: dto.content,
      context: dto.context ?? null,
    });

    // update session updatedAt
    await this.sessionRepo.save({ ...session });

    return this.msgRepo.save(message);
  }

  async findBySession(
    sessionId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    items: ChatMessage[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const [items, total] = await this.msgRepo.findAndCount({
      where: { sessionId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (total === 0) {
      // still ok, just empty result
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }
}
