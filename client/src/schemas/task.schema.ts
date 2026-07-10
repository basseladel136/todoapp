import { z } from 'zod';

export const taskSchema = z.object({
  item: z
    .string()
    .trim()
    .min(3, 'Todo must be at least 3 characters')
    .max(280, 'Todo must be at most 280 characters'),
});

export type TaskValues = z.infer<typeof taskSchema>;
