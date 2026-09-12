// src/utils/sentry.ts
import * as Sentry from '@sentry/node';
import { Express } from 'express';

export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
    });
  }
};

export const setupSentryErrorHandler = (app: Express) => {
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }
};
