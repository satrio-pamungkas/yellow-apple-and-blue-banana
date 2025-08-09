import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { NotFoundException } from '@nestjs/common';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { paginate } from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('TaskService', () => {
  let service: TaskService;
  let repo: jest.Mocked<Repository<Task>>;

  const mockTask = {
    id: 'uuid',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatusEnum.TO_DO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
              getCount: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repo = module.get(getRepositoryToken(Task));
  });

  describe('createTask', () => {
    it('should create and save a new task', async () => {
      const dto: CreateTaskDto = { title: 'New Task', description: 'Details' };
      const task = { ...dto, id: 'uuid' };

      repo.create.mockReturnValue(task as Task);
      repo.save.mockResolvedValue(task as Task);

      const result = await service.createTask(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks without status filter', async () => {
      const options = { page: 1, limit: 10 };
      const paginatedResult = { items: [mockTask], meta: {}, links: {} };
      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      repo.createQueryBuilder.mockReturnValue(queryBuilderMock as any);

      const result = await service.findAll(options);

      expect(paginate).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });

    it('should return paginated tasks with status filter', async () => {
      const options = { page: 1, limit: 10 };
      const paginatedResult = { items: [mockTask], meta: {}, links: {} };
      (paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      repo.createQueryBuilder.mockReturnValue(queryBuilderMock as any);

      const result = await service.findAll(options, TaskStatusEnum.TO_DO);

      expect(queryBuilderMock.where).toHaveBeenCalledWith('task.status = :status', { status: TaskStatusEnum.TO_DO });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      repo.findOne.mockResolvedValue(mockTask as Task);

      const result = await service.findOne('uuid');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 'uuid' } });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Task' };

      repo.findOne.mockResolvedValue(mockTask as Task);
      repo.save.mockResolvedValue({ ...mockTask, ...dto });

      const result = await service.update('uuid', dto);

      expect(result.title).toBe('Updated Task');
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', { title: 'New' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the task', async () => {
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.delete('uuid');

      expect(repo.delete).toHaveBeenCalledWith('uuid');
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.delete('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
