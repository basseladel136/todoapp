import type { Request, Response } from 'express';
import { seedService } from '../services/seed.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const seedController = {
  async seed(_req: Request, res: Response) {
    const result = await seedService.reset();
    // 201 Created — the request produced fresh seed resources.
    return sendSuccess(res, 201, result, 'Database seeded successfully');
  },
};
