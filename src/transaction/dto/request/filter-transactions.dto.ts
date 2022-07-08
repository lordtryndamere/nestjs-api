import { IsOptional } from 'class-validator';

export class FilterTransactionsDto {
  @IsOptional()
  startDate: Date;
  @IsOptional()
  endDate: Date;
}

export class FilterTransactionsByCategoryDto {
  @IsOptional()
  categoryId: number;
  @IsOptional()
  startDate: Date;
  @IsOptional()
  endDate: Date;
}
