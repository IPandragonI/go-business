import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Interest } from '../../interests/entities/interest.entity';

@Entity('categories')
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => Project, (project) => project.categories)
  projects: Project[];

  @ManyToMany(() => Interest, (interest) => interest.categories)
  @JoinTable()
  interests: Interest[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
