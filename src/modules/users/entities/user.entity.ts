import {
    Column, CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserRole} from "./userRole.enum";
import {Project} from "../../projects/entities/project.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lastname: string;

    @Column()
    firstname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.INVESTOR })
    role: UserRole;

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];

    // @Column()
    // interests: string;
    // a lier plus tard en many to many

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
}
