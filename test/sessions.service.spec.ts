import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionsService } from '../src/sessions/sessions.service';
import { ChatSession } from '../src/sessions/entities/chat-session.entity';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createRepoMock = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('SessionsService', () => {
  let service: SessionsService;
  let repo: MockRepo<ChatSession>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(ChatSession),
          useValue: createRepoMock(),
        },
      ],
    }).compile();

    service = module.get(SessionsService);
    repo = module.get(getRepositoryToken(ChatSession));
  });

  it('create(): should create and save a session', async () => {
    const dto = { userId: 'u1', title: 'My Chat' };
    const created = { id: 's1', userId: 'u1', title: 'My Chat', isFavorite: false } as ChatSession;

    repo.create!.mockReturnValue(created);
    repo.save!.mockResolvedValue(created);

    const res = await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith({
      userId: 'u1',
      title: 'My Chat',
      isFavorite: false,
    });
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(res).toEqual(created);
  });

  it('findByUser(): should return sessions ordered by updatedAt desc', async () => {
    const sessions = [{ id: 's1' }, { id: 's2' }] as ChatSession[];
    repo.find!.mockResolvedValue(sessions);

    const res = await service.findByUser('u1');

    expect(repo.find).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      order: { updatedAt: 'DESC' },
    });
    expect(res).toEqual(sessions);
  });

  it('findOne(): should throw NotFoundException when session not found', async () => {
    repo.findOne!.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update(): should update title and favorite flag', async () => {
    const existing = { id: 's1', title: 'Old', isFavorite: false } as ChatSession;
    jest.spyOn(service, 'findOne').mockResolvedValue(existing);

    repo.save!.mockImplementation(async (obj: any) => obj);

    const res = await service.update('s1', { title: 'New', isFavorite: true } as any);

    expect(service.findOne).toHaveBeenCalledWith('s1');
    expect(repo.save).toHaveBeenCalled();
    expect(res.title).toBe('New');
    expect(res.isFavorite).toBe(true);
  });

  it('remove(): should throw if session delete affected 0', async () => {
    repo.delete!.mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove(): should delete session when affected > 0', async () => {
    repo.delete!.mockResolvedValue({ affected: 1 } as any);

    await expect(service.remove('s1')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith({ id: 's1' });
  });
});
