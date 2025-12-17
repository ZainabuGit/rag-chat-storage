import { IsString, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  title?: string;
}
