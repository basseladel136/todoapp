import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';

/**
 * Shared axios instance.
 * `withCredentials: true` makes the browser send/receive the httpOnly auth
 * cookie on every request — the JWT is never touched by JavaScript.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  timeout: 15000,
});

/** Extract a human-friendly message from an axios error. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.message) return data.message;
    if (error.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
    }
    if (!error.response) {
      return 'Unable to reach the server. Please check your connection.';
    }
  }
  return 'Something went wrong, please try again';
}
