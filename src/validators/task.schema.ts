// src/validators/task.schema.ts
import { z } from 'zod';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  email: z.string().min(1, 'User email is required').email('Invalid email format'),
}) satisfies z.ZodType<CreateTaskDto>;

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  email: z.string().email('Invalid email format').optional(),
}) satisfies z.ZodType<UpdateTaskDto>;