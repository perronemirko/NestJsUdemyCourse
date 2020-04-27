import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
//import { Task, TaskStatus } from './task.model'; // BEFORE ORM
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) {}




/* // BEFORE ORM   
    helloWorld(){
      console.log("Hi.");      
        //  this.taskService
    }
    // @Get()
    // getAllTasks(): Task[] {
    //     this.taskService.ciccio();
    //     return this.taskService.getAllTasks();
    // }
    */
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskService.getTasks(filterDto);            
    }
   
    /*
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        //this.taskService.ciccio();
        console.log("filterDto => " + JSON.stringify(filterDto));  
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto);            
        } else {
            return this.taskService.getAllTasks();
        }

    }
    */
    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return await this.taskService.getTaskById(id);
    }
    /*
    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }
    
    // @Post()
    // createTask_withBodyPassed(@Body() body){
    //     console.log('body', body);

    // }
    // @Post()
    // createTask(
    //     @Body('title') title: string,
    //     @Body('description') description: string,
        
    //     ): Task {
    //     console.log('title', title);
    //     console.log('description', description);
    //     return this.taskService.createTask(title, description)
    // }

/// POST Using DTO instead of service
    

*/
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto:CreateTaskDto ): Promise<Task> {
        // console.log('title', title);
        // console.log('description', description);
        // return this.taskService.createTask(title, description)
        return this.taskService.createTask(createTaskDto);   
    }
    /*
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto:CreateTaskDto ): Task {
        // console.log('title', title);
        // console.log('description', description);
        // return this.taskService.createTask(title, description)
        return this.taskService.createTaskWithDto(createTaskDto);   
    }
    */
    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void>{
       return this.taskService.deleteTaskById(id);
    }

    /*
    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void{
        this.taskService.deleteTaskById(id);
    }
*/
    @Patch('/:id/status')
    uodateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.taskService.uodateTaskStatusById(id, status);
    }
/*

    @Patch('/:id/status')
    uodateTaskStatusById(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Task {
        return this.taskService.uodateTaskStatusById(id, status);
    }
*/

}
