/**
 * Task (todo) domain types. Rows come from the `tasks` table in Supabase.
 */
export interface TaskRow {
  id: string;
  item: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/** Public representation of a task — camelCase for the frontend. */
export interface PublicTask {
  id: string;
  item: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function toPublicTask(row: TaskRow): PublicTask {
  return {
    id: row.id,
    item: row.item,
    isCompleted: row.is_completed,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
