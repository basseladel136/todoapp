import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Blocks a route outside development/test. In production it 404s so the
 * endpoint's existence isn't revealed. Defense-in-depth alongside the
 * conditional route mounting in routes/index.ts.
 */
export function devOnly(_req: Request, _res: Response, next: NextFunction): void {
  if (isProduction) {
    throw AppError.notFound('Route not found');
  }
  next();
}
