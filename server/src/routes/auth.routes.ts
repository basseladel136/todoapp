import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { catchAsync } from '../utils/catchAsync.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), catchAsync(authController.register));
router.post('/login', authLimiter, validate(loginSchema), catchAsync(authController.login));
router.post('/logout', catchAsync(authController.logout));

router.get('/me', authenticate, catchAsync(authController.me));
router.post('/refresh', authenticate, catchAsync(authController.refresh));
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  catchAsync(authController.changePassword)
);

export default router;
