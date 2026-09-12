// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import AppError from '../utils/AppError';

export const validate = (schema: z.ZodTypeAny) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const validated = await schema.parseAsync(req.body);
    req.body = validated;
    (req as any).validatedBody = validated;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      const err = new AppError('Validation failed', 400);
      (err as any).details = details;
      return next(err);
    }
    return next(new AppError('Internal Server Error during validation', 500));
  }
};