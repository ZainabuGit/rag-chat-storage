import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessagesService } from '../src/messages/messages.service';
import { ChatMessage } from '../src/messages/entities/chat-message.entity';
import { ChatSession } from '../src/sessions/entities/chat-session.entity';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createRepoMock = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
});

describe('MessagesService', () => {
  let service: MessagesService;
  let msgRepo: MockRepo<ChatMessage>;
  let sessionRepo: MockRepo<ChatSession>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(ChatMessage), useValue: createRepoMock() },
        { provide: getRepositoryToken(ChatSession), useValue: createRepoMock() },
      ],
    }).compile();

    service = module.get(MessagesService);
    msgRepo = module.get(getRepositoryToken(ChatMessage));
    sessionRepo = module.get(getRepositoryToken(ChatSession));
  });

  it('create(): should throw NotFoundException if session does not exist', async () => {
    sessionRepo.findOne!.mockResolvedValue(null);

    await expect(
      service.create('s-missing', { role: 'user', content: 'hi' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(sessionRepo.findOne).toHaveBeenCalledWith({ where: { id: 's-missing' } });
  });

  it('create(): should create and save a message when session exists', async () => {
    const session = { id: 's1' } as ChatSession;
    sessionRepo.findOne!.mockResolvedValue(session);

    const dto = { role: 'user', content: 'Hello', context: { source: 'test' } };
    const created = {
      id: 'm1',
      sessionId: 's1',
      role: dto.role,
      content: dto.content,
      context: dto.context,
      session,
    } as any;

    msgRepo.create!.mockReturnValue(created);
    msgRepo.save!.mockResolvedValue(created);

    // optional: if your service updates session.updatedAt, keep this
    sessionRepo.save!.mockResolvedValue(session);

    const res = await service.create('s1', dto as any);

    expect(msgRepo.create).toHaveBeenCalled();
    expect(msgRepo.save).toHaveBeenCalledWith(created);
    expect(res).toEqual(created);
  });

  it('findBySession(): should return paginated messages', async () => {
    const messages = [{ id: 'm1' }, { id: 'm2' }] as ChatMessage[];
    msgRepo.findAndCount!.mockResolvedValue([messages, 2]);

    const res = await service.findBySession('s1', 2, 10);

    expect(msgRepo.findAndCount).toHaveBeenCalledWith({
      where: { sessionId: 's1' },
      order: { createdAt: 'ASC' },
      skip: 10,
      take: 10,
    });

    expect(res.items).toEqual(messages);
    expect(res.page).toBe(2);
    expect(res.limit).toBe(10);
    expect(res.total).toBe(2);
    expect(res.totalPages).toBe(1);
  });
});
