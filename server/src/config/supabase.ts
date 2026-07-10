import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Server-side Supabase client using the service-role key.
 * This bypasses Row Level Security, so ALL access control (ownership checks,
 * user scoping) is enforced explicitly in the repository/service layers.
 * The service-role key must NEVER be exposed to the frontend.
 */
export const supabase: SupabaseClient = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
