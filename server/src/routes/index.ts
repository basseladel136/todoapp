import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { uptime: process.uptime() } });
});

router.use('/auth', authRoutes);
router.use('/todos', taskRoutes);

export default router;
