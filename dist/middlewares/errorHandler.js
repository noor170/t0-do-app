// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.details && { details: err.details }),
    },
  });
};
