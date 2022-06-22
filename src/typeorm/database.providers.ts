import { DataSource } from 'typeorm';
import entities from './entities';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host:
          'nest-api.cluster-c1rtbhbfjwdb.us-east-1.rds.amazonaws.com' ||
          process.env.HOST,
        port: 3306,
        username: process.env.DB_USER || 'root',
        password: 'Madara*20',
        database: 'nest',
        entities: entities,
        synchronize: true,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];
