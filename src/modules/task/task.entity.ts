import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TaskStatusEnum } from './enums/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
		length: 255 
	})
  title: string;

  @Column({ 
		type: 'text', 
		nullable: true 
	})
  description?: string;

  @Column({ 
    type: 'enum', 
    enum: TaskStatusEnum, 
    default: TaskStatusEnum.TO_DO 
	})
  status: TaskStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
