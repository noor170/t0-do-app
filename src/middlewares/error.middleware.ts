// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate field value constraint violation.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record not found.';
  }

  const reqId = req.headers['x-request-id'] || 'N/A';

  if (statusCode >= 500) {
    logger.error(`[http]: ${statusCode} - ${message} - ${req.method} ${req.url} [reqId: ${reqId}]`, { stack: err.stack });
  } else {
    logger.warn(`[http]: ${statusCode} - ${message} - ${req.method} ${req.url} [reqId: ${reqId}]`);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(err.details && { details: err.details }), // <--- Ensure this line is present
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};