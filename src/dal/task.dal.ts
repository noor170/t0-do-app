// src/dal/task.dal.ts
import prisma from '../utils/prisma';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dtos/task.dto';
import { QueryOptionsDto } from '../dtos/query.dto';

export class TaskDAL {
  static async findAll(userId?: string, options: QueryOptionsDto = {}) {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    if (options.completed !== undefined) {
      where.completed = options.completed;
    }

    if (options.search) {
      where.title = {
        contains: options.search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { email: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string, userId?: string): Promise<TaskResponseDto | null> {
    return prisma.task.findFirst({
      where: {
        id,
        ...(userId && { userId }),
      },
      include: {
        user: { select: { email: true } },
      },
    });
  }

  static async create(userId: string, data: Pick<CreateTaskDto, 'title' | 'description'>): Promise<TaskResponseDto> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
      include: {
        user: { select: { email: true } },
      },
    });
  }

  static async update(id: string, userId: string, data: UpdateTaskDto): Promise<TaskResponseDto> {
    return prisma.task.update({
      where: { id, userId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: Boolean(data.completed) }),
      },
      include: {
        user: { select: { email: true } },
      },
    });
  }

  static async delete(id: string, userId: string): Promise<TaskResponseDto | null> {
    try {
      return await prisma.task.delete({
        where: { id, userId },
        include: {
          user: { select: { email: true } },
        },
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        return null;
      }
      throw err;
    }
  }
}

export default TaskDAL;