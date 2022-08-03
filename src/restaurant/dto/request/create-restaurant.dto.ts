import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  photo: string;
  @IsNotEmpty()
  @IsString()
  latitude: string;
  @IsNotEmpty()
  @IsString()
  longitude: string;
}
