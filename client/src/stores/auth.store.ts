import { create } from 'zustand';
import type { User } from '@/types';

/**
 * Client auth/UI state. Holds only the public user profile — the JWT lives in
 * an httpOnly cookie and is never accessible here. Server data (todos) belongs
 * in TanStack Query, not in this store.
 */
interface AuthState {
  user: User | null;
  /** True until the initial session check (/auth/me) resolves. */
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ isInitializing: value }),
  clear: () => set({ user: null }),
}));
