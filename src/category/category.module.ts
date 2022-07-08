import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/typeorm/database.module';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.provider';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  imports: [DatabaseModule],
  providers: [...categoryProviders, CategoryService],
})
export class CategoryModule {}
