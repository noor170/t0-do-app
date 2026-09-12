  // src/middlewares/errorHandler.middleware.ts
  import { NextFunction, Request, Response } from 'express';
  import { logger } from '../utils/logger';

  export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || 'Internal Server Error';
    const details = err?.details;

    if (statusCode >= 500) {
      logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}\n${err?.stack}`);
    } else {
      logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`);
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        ...(details && { details }),
      },
      ...(process.env.NODE_ENV === 'development' && { stack: err?.stack }),
    });
  };

  export default errorHandler;
