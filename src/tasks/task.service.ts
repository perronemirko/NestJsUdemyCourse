import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
    
    // Refactored
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ) {}    

    async getTasks(filterDto: GetTasksFilterDto,
        user: User,
        ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    public async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto, user);

    }

    public async getTaskById(id: number, user: User): Promise<Task>{
        
        const found = await this.taskRepository.findOne( {where:{id, userId: user.id}});

        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found!`);//We can pass our message through the exception. 
        }
        return found;
    }   

    public async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id}); // The where clause is done under the hood 
        if (result.affected === 0){
            throw new NotFoundException(`Task with ID ${id} not found!`);
            
        }
    }

    public async updateTaskStatusById(id: number, status: TaskStatus, user: User): Promise<Task>{

        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}
