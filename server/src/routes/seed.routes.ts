import { Router } from 'express';
import { seedController } from '../controllers/seed.controller.js';
import { devOnly } from '../middleware/devOnly.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

// Reset + seed the database (development/test only).
router.post('/', devOnly, catchAsync(seedController.seed));

export default router;
