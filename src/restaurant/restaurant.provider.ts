import { DataSource } from 'typeorm';
import { Restaurant } from '../typeorm/entities/restaurant.entitie';

export const restaurantProviders = [
  {
    provide: 'RESTAURANT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Restaurant),
    inject: ['DATA_SOURCE'],
  },
];
