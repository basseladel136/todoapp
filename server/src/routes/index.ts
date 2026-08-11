import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';
import seedRoutes from './seed.routes.js';
import { isProduction } from '../config/env.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { uptime: process.uptime() } });
});

router.use('/auth', authRoutes);
router.use('/todos', taskRoutes);

// Test/seed tooling — mounted only outside production. The route itself also
// carries a `devOnly` guard as defense-in-depth.
if (!isProduction) {
  router.use('/seed', seedRoutes);
}

export default router;
