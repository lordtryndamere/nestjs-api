import { DataSource } from 'typeorm';
import { User } from '../typeorm/entities/user.entitie';

export const authProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
