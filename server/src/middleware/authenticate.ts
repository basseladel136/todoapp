import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

/**
 * Reads the JWT from the httpOnly cookie, verifies it, and attaches the
 * decoded user to `req.user`. Rejects the request otherwise.
 * A bearer token in the Authorization header is accepted as a fallback
 * (useful for API testing), but the cookie is the primary channel.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const cookieToken = req.cookies?.[env.cookieName] as string | undefined;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = cookieToken ?? headerToken;
  if (!token) {
    throw AppError.unauthorized('You must be logged in to access this resource');
  }

  req.user = verifyToken(token);
  next();
}
