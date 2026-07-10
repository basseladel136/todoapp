/**
 * User domain types. Rows come from the `users` table in Supabase.
 * `password_hash` is stored but never leaves the repository layer.
 */
export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

/** Public representation of a user — safe to send to clients. */
export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    createdAt: row.created_at,
  };
}
