import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskService.getTasks(filterDto);            
    }

    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return await this.taskService.getTaskById(id);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto:CreateTaskDto ): Promise<Task> {
        return this.taskService.createTask(createTaskDto);   
    }
 
    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void>{
       return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    uodateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.taskService.uodateTaskStatusById(id, status);
    }

}
