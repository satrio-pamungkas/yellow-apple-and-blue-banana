import { Controller, Post, Get, Patch, Delete, Query, Param, Body, HttpCode, NotFoundException } from "@nestjs/common";
import { TaskStatusEnum } from "./enums/task-status.enum";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  findAll(
    @Query('status') status: TaskStatusEnum,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.taskService.findAll({ page, limit }, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}