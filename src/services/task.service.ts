// src/services/task.service.ts
import TaskDAL from '../dal/task.dal';
import { QueryOptionsDto } from '../dtos/query.dto';
import { TaskResponseDto, CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import AppError from '../utils/AppError';

export class TaskService {
  static async findAll(userId?: string, query: QueryOptionsDto = {}) {
    return TaskDAL.findAll(userId, query);
  }

  static async getTasks(userId?: string, query: QueryOptionsDto = {}) {
    return TaskDAL.findAll(userId, query);
  }

  static async findById(id: string, userId?: string): Promise<TaskResponseDto> {
    const task = await TaskDAL.findById(id, userId);
    if (!task) {
      throw new AppError(`Task with ID ${id} does not exist`, 404);
    }
    return task;
  }

  static async create(userId: string, data: Pick<CreateTaskDto, 'title' | 'description'>): Promise<TaskResponseDto> {
    return TaskDAL.create(userId, data);
  }

  static async update(id: string, userId: string, data: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await TaskDAL.findById(id, userId);
    if (!task) {
      throw new AppError(`Task with ID ${id} does not exist`, 404);
    }

    const updateData: UpdateTaskDto = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) {
      updateData.completed = typeof data.completed === 'string' 
        ? data.completed === 'true' 
        : Boolean(data.completed);
    }

    return TaskDAL.update(id, userId, updateData);
  }

  static async delete(id: string, userId: string): Promise<TaskResponseDto> {
    const task = await TaskDAL.findById(id, userId);
    if (!task) {
      throw new AppError(`Task with ID ${id} does not exist`, 404);
    }

    const deleted = await TaskDAL.delete(id, userId);
    if (!deleted) {
      throw new AppError(`Task with ID ${id} does not exist`, 404);
    }

    return deleted;
  }
}

export default TaskService;