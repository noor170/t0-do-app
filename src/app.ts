// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { logger } from './utils/logger';
import { requestLogger } from './middlewares/request-logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import AppError from './utils/AppError';
import { initSentry, setupSentryErrorHandler } from './utils/sentry';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { apiLimiter } from './middlewares/rate-limiter.middleware';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import client from 'prom-client';

const app = express();

initSentry();
// Collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Expose the metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  } catch (ex) {
    res.status(500).send(ex);
  }
});


// Security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Custom request tracing with correlation IDs
app.use(requestLogger);

app.use('/api', apiLimiter);

// Morgan HTTP request logging bridged to Winston
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// Mount routers
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/users', userRoutes);
setupSentryErrorHandler(app);
// Catch-all 404 handler routed to global error handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;