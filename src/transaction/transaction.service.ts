import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'src/typeorm/entities/transaction.entitie';
import { Between, Repository } from 'typeorm';
import { CreateTransactionDto, EditTransactionDto } from './dto/request';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAllByUserId(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, endDate),
      },
      relations: ['category'],
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async findAllByCategoryId(
    userId: number,
    categoryId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: {
        user: { id: userId },
        category: { id: categoryId },
        createdAt: Between(startDate, endDate),
      },
      relations: ['category'],
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async createTransaction(
    transaction: CreateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    try {
      const transactionRecord = await this.transactionRepository.save({
        ...transaction,
        category: { id: transaction.categoryId },
        user: { id: userId },
        createdAt: new Date(),
      });
      return transactionRecord;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async editTransactionById(
    userId: number,
    transactionId: number,
    dto: EditTransactionDto,
  ) {
    try {
      const findTransaction = await this.transactionRepository.findOne({
        where: { id: transactionId, user: { id: userId } },
      });
      if (!findTransaction)
        throw new ForbiddenException('Access to resources denied');
      return this.transactionRepository.update(
        {
          id: findTransaction.id,
        },
        { ...dto, updatedAt: new Date() },
      );
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
