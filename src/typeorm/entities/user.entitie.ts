import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bookmark } from './bookmark.entitie';
import { Transaction } from './transaction.entitie';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  email: string;

  @Column()
  hash: string;
  @Column({
    default: '0',
    nullable: true,
  })
  initialAmount: string;
  @Column({
    nullable: true,
  })
  currentAmount: string;
  @Column({
    nullable: true,
  })
  alvailableForNextMonth: string;
  @Column({
    default: 'COP',
    nullable: true,
  })
  currency: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
