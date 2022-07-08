import { IsOptional, IsString } from 'class-validator';

export class EditCategoryDto {
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  color: string;
}
