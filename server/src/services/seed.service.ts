import { authService } from './auth.service.js';
import { taskService } from './task.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { taskRepository } from '../repositories/task.repository.js';
import type { PublicUser } from '../models/user.model.js';
import type { PublicTask } from '../models/task.model.js';

/**
 * Fixed, predictable seed data so automated tests (Postman/CI) are repeatable.
 */
export const SEED_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Password123!',
} as const;

export const SEED_TODOS = ['Learn Postman', 'Learn Selenium', 'Learn Cypress'] as const;

export interface SeedResult {
  user: PublicUser;
  token: string;
  tasks: PublicTask[];
}

export const seedService = {
  /**
   * Resets the database to a known clean state and inserts deterministic
   * sample data. Returns the seed user plus a valid JWT for it.
   *
   * Reuses existing building blocks — no duplicated auth logic:
   *  - password hashing + JWT signing come from `authService.register`
   *  - task creation goes through `taskService` → `taskRepository`
   */
  async reset(): Promise<SeedResult> {
    // 1. Wipe existing data in FK-safe order: tasks first, then users.
    //    (users → tasks is ON DELETE CASCADE, but we delete explicitly for clarity.)
    await taskRepository.deleteAll();
    await userRepository.deleteAll();

    // 2. Create the seed user via the same path as Register
    //    (bcrypt hashing + signToken), giving us the user and a valid token.
    const { user, token } = await authService.register({ ...SEED_USER });

    // 3. Insert the sample todos in a fixed order for predictable results.
    const tasks: PublicTask[] = [];
    for (const item of SEED_TODOS) {
      tasks.push(await taskService.create({ item, userId: user.id }));
    }

    return { user, token, tasks };
  },
};
