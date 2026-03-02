import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserRole} from "./userRole.enum";

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

    // @Column()
    // interests: string;
    // a lier plus tard en many to many

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
