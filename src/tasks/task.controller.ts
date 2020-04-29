import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {    

    private logger = new Logger('TaskController');
    constructor(private taskService: TaskService) {}
    
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, 
    @GetUser() user: User,
    ): Promise<Task[]>{
        this.logger.verbose(`User ${user.username} retrieving all tasks. ${JSON.stringify(filterDto)}`);
        return this.taskService.getTasks(filterDto, user);            
    }

    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number,     
    @GetUser() user: User,
    ): Promise<Task> {
        return await this.taskService.getTaskById(id, user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto:CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating a new task. ${JSON.stringify(createTaskDto)}`);
        return this.taskService.createTask(createTaskDto, user);   
    }
 
    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    ): Promise<void>{
        this.logger.verbose(`User ${user.username} is deleting the task with id: ${id}.`);
        return this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    uodateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.updateTaskStatusById(id, status, user);
    }

}
