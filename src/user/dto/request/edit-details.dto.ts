import { IsOptional, IsString } from 'class-validator';

export class EditDetailsDto {
  @IsOptional()
  @IsString()
  initialAmount: string;
  @IsOptional()
  @IsString()
  currentAmount: string;
  @IsOptional()
  @IsString()
  alvailableForNextMonth: string;
  @IsOptional()
  @IsString()
  currency: string;
}
