import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
