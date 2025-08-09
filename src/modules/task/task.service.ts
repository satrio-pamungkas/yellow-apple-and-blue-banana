import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { TaskStatusEnum } from "./enums/task-status.enum";
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class TaskService {
constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  createTask(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(dto);
    return this.taskRepo.save(task);
  }

  async findAll(
    options: IPaginationOptions,
    status?: TaskStatusEnum,
  ): Promise<Pagination<Task>> {
    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    if (status) {
      queryBuilder.where('task.status = :status', { status });
    }

    queryBuilder.orderBy('task.createdAt', 'DESC');

    return paginate<Task>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.taskRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException();
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException();
  }
}