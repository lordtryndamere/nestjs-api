import { DataSource } from 'typeorm';
import entities from './entities';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        // host: 'localhost',
        // port: 5434,
        // username: 'postgres',
        // password: '123',
        // database: 'nest',
        url: process.env.DATABASE_URL,
        entities: entities,
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];
