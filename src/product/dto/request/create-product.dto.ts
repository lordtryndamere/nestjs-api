import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  photo: string;
  @IsNotEmpty()
  @IsString()
  price: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @IsNumber()
  restaurant: { id: number };
}
