import { z } from 'zod';

const itemSchema = z
  .string()
  .trim()
  .min(3, 'Todo must be at least 3 characters')
  .max(280, 'Todo must be at most 280 characters');

export const createTaskSchema = z.object({
  body: z.object({
    item: itemSchema,
  }),
});

export const updateTaskSchema = z.object({
  body: z
    .object({
      item: itemSchema.optional(),
      isCompleted: z.boolean().optional(),
    })
    .refine((data) => data.item !== undefined || data.isCompleted !== undefined, {
      message: 'Provide at least one field to update (item or isCompleted)',
    }),
  params: z.object({
    id: z.string().uuid('Invalid task id'),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task id'),
  }),
});

export const listTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().max(280).optional(),
    status: z.enum(['all', 'active', 'completed']).optional().default('all'),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(5),
  }),
});
