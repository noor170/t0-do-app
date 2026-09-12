import 'dotenv/config';
import app from './app';
import { logger } from './utils/logger';


const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (error: Error) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down...\n${error.stack}`);
  process.exit(1);
});

const server = app.listen(Number(PORT), () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error(`UNHANDLED REJECTION! Shutting down...\n${reason.stack || reason}`);
  server.close(() => {
    process.exit(1);
  });
});