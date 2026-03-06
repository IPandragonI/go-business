import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('investments')
export class Investment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  investor: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @CreateDateColumn({ type: 'timestamp' })
  investedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

