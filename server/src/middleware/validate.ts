import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Validates and sanitizes request data against a Zod schema shaped like
 * `{ body?, query?, params? }`. Parsed output (with coercions/defaults applied)
 * is attached to `req.validated` so handlers use clean, typed data.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as Request['validated'];
      req.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.errors[0];
        const message = first ? first.message : 'Invalid request data';
        next(AppError.badRequest(message, err.flatten().fieldErrors));
        return;
      }
      next(err);
    }
  };
