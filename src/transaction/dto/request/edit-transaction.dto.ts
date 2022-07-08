import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditTransactionDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsNotEmpty()
  total: string;
  @IsNumber()
  @IsOptional()
  categoryId: number;
}
