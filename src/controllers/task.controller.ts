// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from 'express';
import TaskService from '../services/task.service';
import AppError from '../utils/AppError';
import prisma from '../utils/prisma';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const queryOptions = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
      completed: req.query.completed !== undefined ? req.query.completed === 'true' : undefined,
      search: req.query.search as string,
    };

    const result = await TaskService.findAll(userId, queryOptions);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

export { getTasks as getAllTasks };

export const getTaskById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const task = await TaskService.findById(id, userId);
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (
  req: Request<{}, {}, CreateTaskDto & { email?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = (req as any).validatedBody || req.body || {};
    const { title, description, email } = body;
    let userId = (req as any).user?.id;

    if (!userId && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(new AppError('User not found with this email', 404));
      }
      userId = user.id;
    }

    if (!userId) {
      return next(new AppError('Unauthorized: Provide an auth token or user email', 401));
    }

    const task = await TaskService.create(userId, { title, description });
    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (
  req: Request<{ id: string }, {}, UpdateTaskDto & { email?: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const body = (req as any).validatedBody || req.body || {};
  const { title, description, completed, email } = body;
  let userId = (req as any).user?.id;

  try {
    if (!userId && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(new AppError('User not found with this email', 404));
      }
      userId = user.id;
    }

    if (!userId) {
      return next(new AppError('Unauthorized: Provide an auth token or user email', 401));
    }

    const updated = await TaskService.update(id, userId, {
      title,
      description,
      completed,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    if (err instanceof AppError || err?.statusCode) {
      return next(err);
    }
    return next(new AppError('Failed to update task', 500));
  }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const deleted = await TaskService.delete(id, userId);
    return res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    return next(error);
  }
};