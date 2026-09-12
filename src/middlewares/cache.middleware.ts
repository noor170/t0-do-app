// src/middlewares/cache.middleware.ts
import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export const cacheMiddleware = (keyPrefix: string, ttlSeconds = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Intercept res.json to cache the response before sending it
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode === 200) {
          redis.setex(key, ttlSeconds, JSON.stringify(body));
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      // Fallback to database if Redis fails
      next();
    }
  };
};