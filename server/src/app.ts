import express, { type Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp(): Application {
  const app = express();

  // Trust the first proxy (needed for secure cookies + rate limiting behind a proxy).
  app.set('trust proxy', 1);

  // Security headers.
  app.use(helmet());

  // CORS with credentials so the browser sends/receives the httpOnly cookie.
  app.use(
    cors({
      origin: env.clientOrigin.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );

  // Body & cookie parsing.
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // Never cache API responses.
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    next();
  });

  // Rate limiting for the whole API surface.
  app.use('/api', apiLimiter);

  // Routes.
  app.use('/api/v1', apiRoutes);

  // 404 + global error handler (must be last).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
