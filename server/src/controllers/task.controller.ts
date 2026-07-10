import type { Request, Response } from 'express';
import { taskService } from '../services/task.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import type { TaskStatusFilter } from '../repositories/task.repository.js';

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

interface ListQuery {
  search?: string;
  status: TaskStatusFilter;
  page: number;
  limit: number;
}

export const taskController = {
  async list(req: Request, res: Response) {
    const userId = requireUserId(req);
    const query = req.validated?.query as ListQuery;
    const result = await taskService.list({ userId, ...query });
    return sendSuccess(res, 200, result, 'Tasks retrieved');
  },

  async getOne(req: Request, res: Response) {
    const userId = requireUserId(req);
    const { id } = req.params;
    const task = await taskService.getById(id, userId);
    return sendSuccess(res, 200, { task }, 'Task retrieved');
  },

  async create(req: Request, res: Response) {
    const userId = requireUserId(req);
    const { item } = req.validated?.body as { item: string };
    const task = await taskService.create({ item, userId });
    return sendSuccess(res, 201, { task }, 'Task created');
  },

  async update(req: Request, res: Response) {
    const userId = requireUserId(req);
    const { id } = req.params;
    const changes = req.validated?.body as {
      item?: string;
      isCompleted?: boolean;
    };
    const task = await taskService.update(id, userId, changes);
    return sendSuccess(res, 200, { task }, 'Task updated');
  },

  async remove(req: Request, res: Response) {
    const userId = requireUserId(req);
    const { id } = req.params;
    const task = await taskService.remove(id, userId);
    return sendSuccess(res, 200, { task }, 'Task deleted');
  },
};
