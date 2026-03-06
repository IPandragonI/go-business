import {
  Column, CreateDateColumn,
  Entity, OneToMany, ManyToMany, JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './userRole.enum';
import { Project } from '../../projects/entities/project.entity';
import { Interest } from '../../interests/entities/interest.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @Column({ type: 'varchar', length: 100 })
  firstname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INVESTOR })
  role: UserRole;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => Investment, (investment) => investment.investor)
  investments: Investment[];

  @ManyToMany(() => Interest, (interest) => interest.users)
  @JoinTable()
  interests: Interest[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
