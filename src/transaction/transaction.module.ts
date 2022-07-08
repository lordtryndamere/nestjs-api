import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/typeorm/database.module';
import { TransactionController } from './transaction.controller';
import { transactionProviders } from './transaction.provider';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionController],
  providers: [...transactionProviders, TransactionService],
})
export class TransactionModule {}
