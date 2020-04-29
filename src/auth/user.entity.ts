import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{

@PrimaryGeneratedColumn()
id: number;

@Column()
username: string;

@Column()
password: string;

@Column()
salt: string;

//1 to Many relationship
/*
When eager is set to true => whenever we retrieve the user as an object we can access user.task
Immediately adn get an array of tasks owned by the same user.
One side of thev relationship can e eage, not both of them 
*/
@OneToMany(type => Task, task => task.user, { eager:true} )
tasks: Task[];

async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
    }
}