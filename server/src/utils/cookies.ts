import type { CookieOptions, Response } from 'express';
import { env, isProduction } from '../config/env.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Cookie options for the auth token.
 * - httpOnly: JWT is never readable from JavaScript (XSS mitigation)
 * - sameSite/secure: CSRF hardening; 'none'+secure required for cross-site in prod
 */
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: SEVEN_DAYS_MS,
  path: '/',
};

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.cookieName, token, authCookieOptions);
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(env.cookieName, {
    ...authCookieOptions,
    maxAge: undefined,
  });
}
