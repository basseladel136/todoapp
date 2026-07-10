import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import type { TaskRow } from '../models/task.model.js';

const TABLE = 'tasks';

export type TaskStatusFilter = 'all' | 'active' | 'completed';

export interface ListTasksParams {
  userId: string;
  search?: string;
  status?: TaskStatusFilter;
  page: number;
  limit: number;
}

export interface ListTasksResult {
  rows: TaskRow[];
  total: number;
}

/**
 * Data-access layer for tasks. Every query is scoped by user_id so a user
 * can only ever read or mutate their own todos.
 */
export const taskRepository = {
  async list(params: ListTasksParams): Promise<ListTasksResult> {
    const { userId, search, status, page, limit } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (status === 'active') query = query.eq('is_completed', false);
    if (status === 'completed') query = query.eq('is_completed', true);

    if (search && search.trim() !== '') {
      // ilike is parameterized by the client; escape LIKE wildcards in input.
      const term = search.replace(/[%_]/g, (m) => `\\${m}`);
      query = query.ilike('item', `%${term}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new AppError(error.message, 500);
    return { rows: (data ?? []) as TaskRow[], total: count ?? 0 };
  },

  async findByIdForUser(id: string, userId: string): Promise<TaskRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data as TaskRow | null;
  },

  async create(input: { item: string; userId: string }): Promise<TaskRow> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ item: input.item, user_id: input.userId })
      .select('*')
      .single();

    if (error) throw new AppError(error.message, 500);
    return data as TaskRow;
  },

  async update(
    id: string,
    userId: string,
    changes: { item?: string; isCompleted?: boolean }
  ): Promise<TaskRow | null> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (changes.item !== undefined) payload.item = changes.item;
    if (changes.isCompleted !== undefined) payload.is_completed = changes.isCompleted;

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data as TaskRow | null;
  },

  async remove(id: string, userId: string): Promise<TaskRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data as TaskRow | null;
  },
};
