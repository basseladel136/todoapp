import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { isProduction } from '../config/env.js';

/** Catch-all for unmatched routes. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Global error middleware. Produces a consistent error envelope:
 *   { success: false, message, details? }
 * Non-operational errors are logged and hidden behind a generic message in prod.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // next is required for Express to treat this as an error handler
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Unexpected / programming error.
  // eslint-disable-next-line no-console
  console.error('[UNEXPECTED ERROR]', err);

  res.status(500).json({
    success: false,
    message: isProduction
      ? 'Something went wrong, please try again'
      : err instanceof Error
        ? err.message
        : 'Unknown error',
  });
}
