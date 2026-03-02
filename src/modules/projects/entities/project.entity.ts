import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from 'typeorm';
import {User} from "../../users/entities/user.entity";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    budget?: number;

    //TODO : créer une relation ManyToOne avec une table de categories
    @Column()
    category: string;

    @ManyToOne(() => User, (owner) => owner.projects, {onDelete: 'CASCADE'})
    owner: User;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
}
