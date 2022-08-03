import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/typeorm/database.module';
import { ProductController } from './product.controller';
import { productProviders } from './product.provider';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  imports: [DatabaseModule],
  providers: [...productProviders, ProductService],
})
export class ProductModule {}
