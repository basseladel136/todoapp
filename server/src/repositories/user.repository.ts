import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import type { UserRow } from '../models/user.model.js';

const TABLE = 'users';

/**
 * Data-access layer for users. All queries go through the Supabase client,
 * which uses parameterized requests (no string-concatenated SQL) — this is
 * the primary defense against SQL injection.
 */
export const userRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data as UserRow | null;
  },

  async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data as UserRow | null;
  },

  async create(input: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }): Promise<UserRow> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email.toLowerCase(),
        password_hash: input.passwordHash,
      })
      .select('*')
      .single();

    if (error) throw new AppError(error.message, 500);
    return data as UserRow;
  },

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ password_hash: passwordHash })
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
  },
};
