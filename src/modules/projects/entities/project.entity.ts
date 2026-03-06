import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Entity('projects')
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget?: number;

  @ManyToMany(() => Category, (category) => category.projects)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (owner) => owner.projects, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Investment, (investment) => investment.project)
  investments: Investment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
