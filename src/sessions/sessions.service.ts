import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly repo: Repository<ChatSession>,
  ) {}

  async create(dto: CreateSessionDto): Promise<ChatSession> {
    const session = this.repo.create({
      userId: dto.userId,
      title: dto.title || 'New Chat',
      isFavorite: false,
    });
    return this.repo.save(session);
  }

  async findByUser(userId: string, isFavorite?: boolean): Promise<ChatSession[]> {
    const where: any = { userId };
    if (typeof isFavorite === 'boolean') {
      where.isFavorite = isFavorite;
    }
    return this.repo.find({
      where,
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ChatSession> {
    const session = await this.repo.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async update(id: string, dto: UpdateSessionDto): Promise<ChatSession> {
    const session = await this.findOne(id);
    Object.assign(session, dto);
    return this.repo.save(session);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Session not found');
    }
  }
}
