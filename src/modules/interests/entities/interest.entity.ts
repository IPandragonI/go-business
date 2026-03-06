import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('interests')
export class Interest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.interests)
  users: User[];

  @ManyToMany(() => Category, (category) => category.interests)
  categories: Category[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

