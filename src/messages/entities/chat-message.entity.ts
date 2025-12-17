import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MessageRole } from '../dto/create-message.dto';
import { ChatSession } from '../../sessions/entities/chat-session.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ChatSession;

  // @Column()
  // role: string; // 'user' | 'assistant'

  @Column('text')
  content: string;

  @Column('jsonb', { nullable: true })
  context: any;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar' })
  role: MessageRole;
}
