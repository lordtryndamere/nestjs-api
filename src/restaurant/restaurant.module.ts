import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/typeorm/database.module';
import { RestaurantController } from './restaurant.controller';
import { restaurantProviders } from './restaurant.provider';
import { RestaurantService } from './restaurant.service';

@Module({
  controllers: [RestaurantController],
  imports: [DatabaseModule],
  providers: [...restaurantProviders, RestaurantService],
})
export class RestaurantModule {}
