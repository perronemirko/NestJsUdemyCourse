import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status-enum";
import { GetTasksFilterDto } from "./dto/get-tasks.dto";

@EntityRepository(Task)//Task is the Repository Class who will be passed trough the Repository using Dependency injection
export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        const {status, search} = filterDto;
        // Query Builder
        const query = this.createQueryBuilder('task');
        // Andware id Different from where. The Were module override all the Andware modules. 
        if (status) {
            //query.andWhere('task.status = :status', { status: 'OPEN'}) //static
            query.andWhere('task.status = :status', { status}) // Dynamic provided by the client
        }

        if (search) {
            //query.andWhere('task.status = :status', { status: 'OPEN'}) //static
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` }) // `%${search}%`=> Partial matchers. //Search also for partial provided string Dynamic provided by the client
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        
        task.title = title; 
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
    }
}