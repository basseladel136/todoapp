import {
  taskRepository,
  type TaskStatusFilter,
} from '../repositories/task.repository.js';
import { AppError } from '../utils/AppError.js';
import { toPublicTask, type PublicTask } from '../models/task.model.js';

export interface ListTasksInput {
  userId: string;
  search?: string;
  status?: TaskStatusFilter;
  page: number;
  limit: number;
}

export interface PaginatedTasks {
  tasks: PublicTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const taskService = {
  async list(input: ListTasksInput): Promise<PaginatedTasks> {
    const { rows, total } = await taskRepository.list(input);
    return {
      tasks: rows.map(toPublicTask),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / input.limit)),
      },
    };
  },

  async getById(id: string, userId: string): Promise<PublicTask> {
    const row = await taskRepository.findByIdForUser(id, userId);
    if (!row) throw AppError.notFound('We could not find that task');
    return toPublicTask(row);
  },

  async create(input: { item: string; userId: string }): Promise<PublicTask> {
    const row = await taskRepository.create(input);
    return toPublicTask(row);
  },

  async update(
    id: string,
    userId: string,
    changes: { item?: string; isCompleted?: boolean }
  ): Promise<PublicTask> {
    const row = await taskRepository.update(id, userId, changes);
    if (!row) throw AppError.notFound('We could not find that task');
    return toPublicTask(row);
  },

  async remove(id: string, userId: string): Promise<PublicTask> {
    const row = await taskRepository.remove(id, userId);
    if (!row) throw AppError.notFound('We could not find that task');
    return toPublicTask(row);
  },
};
