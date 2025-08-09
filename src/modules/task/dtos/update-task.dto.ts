import { IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsOptional()
  @MaxLength(255)
  @ApiProperty()
  title?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  @ApiProperty()
  status?: TaskStatusEnum;
}
