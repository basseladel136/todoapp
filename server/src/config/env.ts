import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Load `.env` relative to THIS file, not `process.cwd()`.
 *
 * Running the server via `npm --prefix server run dev` (or from the repo root)
 * leaves the process cwd at the repo root, so a cwd-relative lookup would miss
 * `server/.env` and every variable — including PORT — would be undefined.
 *
 * This file lives at `server/src/config/env.ts` (dev, run by tsx) and
 * `server/dist/config/env.js` (prod). In both cases `../../.env` is `server/.env`.
 */
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(currentDir, '../../.env');
dotenv.config({ path: envPath });

/**
 * Centralized, validated environment configuration.
 * Fails fast on startup if a required variable is missing.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  // Port is driven entirely by the environment; 8080 is only a last-resort default.
  port: Number(optional('PORT', '8080')),

  // Supabase
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),

  // Auth
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
  cookieName: optional('COOKIE_NAME', 'todo_token'),

  // CORS
  clientOrigin: optional('CLIENT_ORIGIN', 'http://localhost:5173'),
} as const;

export const isProduction = env.nodeEnv === 'production';
