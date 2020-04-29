import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskStatus } from "./task-status-enum";
import { User } from "src/auth/user.entity";

@Entity()
export class Task extends BaseEntity{ // Repository Class who will be passed trough the Repository using Dependency injection
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    //1 to Many relationship
    @ManyToOne(type => User, user => user.tasks, { eager:false } )
    user: User;

    @Column()
    userId: number;
}