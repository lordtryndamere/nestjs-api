import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entitie';
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;
  @Column({
    nullable: true,
  })
  latitude: string;
  @Column({
    nullable: true,
  })
  longitude: string;

  @Column({
    length: 255,
    default:
      'https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png',
  })
  photo: string;
  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];
}
