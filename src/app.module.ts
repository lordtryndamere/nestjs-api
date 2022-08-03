import { Module, Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
//import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    //  PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionModule,
    CategoryModule,
    ProductModule,
    RestaurantModule,
  ],
  providers: [Logger],
})
export class AppModule {}
