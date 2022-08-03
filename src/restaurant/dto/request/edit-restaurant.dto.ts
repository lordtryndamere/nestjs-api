import { IsOptional, IsString } from 'class-validator';

export class EditRestaurantDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsString()
  latitude: string;
  @IsOptional()
  @IsString()
  longitude: string;
  @IsOptional()
  @IsString()
  rating: string;
}
