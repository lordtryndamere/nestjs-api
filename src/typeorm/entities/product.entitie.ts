import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Restaurant } from './restaurant.entitie';
@Entity()
export class Product {
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
  @Column({})
  price: string;
  @Column({})
  quantity: number;

  @Column({
    default:
      'https://img2.freepng.es/20180422/gbw/kisspng-popcorn-computer-icons-fizzy-drinks-junk-food-cinema-popcorn-5add3cd988e376.1643583815244484735607.jpg',
  })
  photo: string;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  restaurant: Restaurant;
}
