import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
//import * as uuid from 'uuid/v1';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';

@Injectable()
export class TaskService {
    private tasks: Task[] = [];
    /**
     * ciccio
     */
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

    /**
     * createTask
     */
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



    public getTaskById(id: string): Task{
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
           // throw new NotFoundException();
            throw new NotFoundException(`Task with id ${id} not found!`);//We can pass our message through the exception. 
        }
        return found;
    }   
    

    public deleteTaskById(id: string): void{
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    public uodateTaskStatusById(id: string, status: TaskStatus): Task{
       const task = this.getTaskById(id);
       task.status = status;
       return task;
    }

}
