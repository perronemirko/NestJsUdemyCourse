import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status-enum";
import { GetTasksFilterDto } from "./dto/get-tasks.dto";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)//Task is the Repository Class who will be passed trough the Repository using Dependency injection
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository');
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{

        const {status, search} = filterDto;
        // Query Builder
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id  });
        // Andware id Different from where. The Were module override all the Andware modules. 
        if (status) {
            query.andWhere('task.status = :status', { status}) // Dynamic provided by the client
        }

        if (search) {

            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` }) // `%${search}%`=> Partial matchers. //Search also for partial provided string Dynamic provided by the client
        }
        try {            
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", Filteres => ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto,
        user: User): Promise<Task> {
            
        const { title, description } = createTaskDto;

        const task = new Task();
        
        task.title = title; 
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {            
            await task.save();
        } catch (error) {
            this.logger.error(`Failed to create task for user "${user.username}". Data => ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
        delete task.user;
        return task;
    }
}