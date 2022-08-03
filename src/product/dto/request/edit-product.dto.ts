import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
