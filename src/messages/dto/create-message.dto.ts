import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class CreateMessageDto {
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  content: string;

  @IsOptional()
  context?: any;
}
