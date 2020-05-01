import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { TaskStatus } from './task-status-enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test user' };
;
const mockTaskRepository = () =>({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
}); // Factory function that simply returns a object

describe('TaskService', () => {
    let taskService;
    let taskRepository;
    
    beforeEach( async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                TaskService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        taskService = await module.get<TaskService>(TaskService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');   
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
            // call taskService.getTasks
            const reuslt = await taskService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(reuslt).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesffuly retrieve and return the task', async () => {
          const mockTask = { title: 'Test task', description: 'Test desc' };
          taskRepository.findOne.mockResolvedValue(mockTask);
    
          const result = await taskService.getTaskById(1, mockUser);
          expect(result).toEqual(mockTask);
    
          expect(taskRepository.findOne).toHaveBeenCalledWith({
            where: {
              id: 1,
              userId: mockUser.id,
            },
          });
        });
    
        it('throws an error as task is not found', () => {
          taskRepository.findOne.mockResolvedValue(null);
          expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
      });
    
    describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
        taskRepository.createTask.mockResolvedValue('someTask');

        expect(taskRepository.createTask).not.toHaveBeenCalled();
        const createTaskDto = { title: 'Test task', description: 'Test desc' };
        const result = await taskService.createTask(createTaskDto, mockUser);
        expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
        expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 1 });
        expect(taskRepository.delete).not.toHaveBeenCalled();
        await taskService.deleteTaskById(1, mockUser);
        expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('throws an error as task could not be found', () => {
        taskRepository.delete.mockResolvedValue({ affected: 0 });
        expect(taskService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
        const save = jest.fn().mockResolvedValue(true);

        taskService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
        });

        expect(taskService.getTaskById).not.toHaveBeenCalled();
        expect(save).not.toHaveBeenCalled();
        const result = await taskService.updateTaskStatusById(1, TaskStatus.DONE, mockUser);
        expect(taskService.getTaskById).toHaveBeenCalled();
        expect(save).toHaveBeenCalled();
        expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});