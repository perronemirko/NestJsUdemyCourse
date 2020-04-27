import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';

@Injectable()
export class TaskService {
    // Refactored
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ) {}    

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto);

    }

    public async getTaskById(id: number): Promise<Task>{
        
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found!`);//We can pass our message through the exception. 
        }
        return found;
    }   

    public async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        console.log(result);  
        if (result.affected === 0){
            throw new NotFoundException(`Task with ID ${id} not found!`);
            
        }
    }

    public async uodateTaskStatusById(id: number, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
