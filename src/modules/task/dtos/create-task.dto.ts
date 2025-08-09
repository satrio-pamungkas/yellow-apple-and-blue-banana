import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  description?: string;
}