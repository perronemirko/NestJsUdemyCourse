import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './task.model'; // BEFORE ORM
//import * as uuid from 'uuid/v1'; // BEFORE ORM
//import { v4 as uuidv4 } from 'uuid'; // BEFORE ORM
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';

@Injectable()
export class TaskService {
    // Refactoring
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ) {}    



    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }
/* // BEFORE ORM
    private tasks: Task[] = [];

    public ciccio() {
        console.log("ciccio");
        
    }
    
    public getAllTasks() : Task[] {
        return this.tasks;
    }
    
    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const { status, search} = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        } 
        if(search) {
            tasks = tasks.filter( task=>
                task.title.includes(search) ||
                task.description.includes(search),
            );    
        }

        return tasks;

    }

    */
     
   public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto);
    //    const { title, description } = createTaskDto;

    //     const task = new Task();
        
    //     task.title = title; 
    //     task.description = description;
    //     task.status = TaskStatus.OPEN;
    //     await task.save();
    //     return task;
    }


/*
    public createTask(title: string, description: string): Task {
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    protected createTask_withBodyPassed(title: string, description: string): Task {
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }
    public createTaskWithDto(createTaskDto: CreateTaskDto): Task {
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }
*/
    public async getTaskById(id: number): Promise<Task>{
        
        const found = await this.taskRepository.findOne(id);

        if (!found) {
           // throw new NotFoundException();
            throw new NotFoundException(`Task with id ${id} not found!`);//We can pass our message through the exception. 
        }
        return found;
    }   
/*
    public getTaskById(id: string): Task{
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
           // throw new NotFoundException();
            throw new NotFoundException(`Task with id ${id} not found!`);//We can pass our message through the exception. 
        }
        return found;
    }   
    
*/
    public async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        console.log(result);  
        if (result.affected === 0){
            throw new NotFoundException(`Task with ID ${id} not found!`);
            
        }
    }
/*

    public deleteTaskById(id: string): void{
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }
*/
    public async uodateTaskStatusById(id: number, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
/*

    public uodateTaskStatusById(id: string, status: TaskStatus): Task{
       const task = this.getTaskById(id);
       task.status = status;
       return task;
    }
*/
}
