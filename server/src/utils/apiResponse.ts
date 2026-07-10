import type { Response } from 'express';

/**
 * Consistent JSON envelope for every successful response:
 *   { success: true, message, data }
 * Errors use the same shape with success:false (see errorHandler).
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  message = 'OK'
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
