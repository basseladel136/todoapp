import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import type {
  RegisterBody,
  LoginBody,
  ChangePasswordBody,
} from '../validators/auth.validator.js';

export const authController = {
  async register(req: Request, res: Response) {
    const body = req.validated?.body as RegisterBody;
    const { user, token } = await authService.register(body);
    setAuthCookie(res, token);
    return sendSuccess(res, 201, { user }, 'Account created successfully');
  },

  async login(req: Request, res: Response) {
    const body = req.validated?.body as LoginBody;
    const { user, token } = await authService.login(body);
    setAuthCookie(res, token);
    return sendSuccess(res, 200, { user }, 'Logged in successfully');
  },

  async logout(_req: Request, res: Response) {
    clearAuthCookie(res);
    return sendSuccess(res, 200, null, 'Logged out successfully');
  },

  /** Verify session + return current user. */
  async me(req: Request, res: Response) {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, 200, { user }, 'Session is valid');
  },

  /** Optional: issue a fresh cookie from a still-valid session (sliding expiry). */
  async refresh(req: Request, res: Response) {
    if (!req.user) throw AppError.unauthorized();
    const user = await authService.getCurrentUser(req.user.id);
    setAuthCookie(res, signToken(user));
    return sendSuccess(res, 200, { user }, 'Session refreshed');
  },

  async changePassword(req: Request, res: Response) {
    if (!req.user) throw AppError.unauthorized();
    const body = req.validated?.body as ChangePasswordBody;
    const user = await authService.changePassword({
      userId: req.user.id,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
    // Re-issue token so any embedded claims stay fresh.
    setAuthCookie(res, signToken(user));
    return sendSuccess(res, 200, { user }, 'Password changed successfully');
  },
};
