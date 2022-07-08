import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import {
  FilterTransactionsDto,
  FilterTransactionsByCategoryDto,
  CreateTransactionDto,
  EditTransactionDto,
} from './dto/request';
import { TransactionService } from './transaction.service';

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('findAllTransactions')
  getMyTransactions(
    @GetUser('id') userId: number,
    @Param() params: FilterTransactionsDto,
  ) {
    return this.transactionService.findAllByUserId(
      userId,
      params.startDate,
      params.endDate,
    );
  }
  @Get('findAllByCategory')
  getMyTransactionsByCategory(
    @GetUser('id') userId: number,
    @Param() params: FilterTransactionsByCategoryDto,
  ) {
    return this.transactionService.findAllByCategoryId(
      userId,
      params.categoryId,
      params.startDate,
      params.endDate,
    );
  }
  @Patch(':id')
  editTransactionById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditTransactionDto,
  ) {
    return this.transactionService.editTransactionById(userId, id, dto);
  }
  @Post('create')
  createTransaction(
    @GetUser('id') userId: number,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(dto, userId);
  }
}
