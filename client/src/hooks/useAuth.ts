import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiResponse, User } from '@/types';
import type {
  ChangePasswordValues,
  LoginValues,
  SignupValues,
} from '@/schemas/auth.schema';

type AuthPayload = ApiResponse<{ user: User }>;

/**
 * Runs once on app start: asks the server whether the session cookie is valid
 * and hydrates the auth store. No token is stored client-side.
 */
export function useSessionBootstrap() {
  const { setUser, setInitializing } = useAuthStore();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get<AuthPayload>('/auth/me');
        if (active) setUser(data.data.user);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [setUser, setInitializing]);
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data } = await api.post<AuthPayload>('/auth/login', values);
      return data.data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/todos', { replace: true });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useSignup() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: SignupValues) => {
      const { confirmPassword: _confirm, ...payload } = values;
      const { data } = await api.post<AuthPayload>('/auth/register', payload);
      return data.data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      toast.success(`Welcome, ${user.firstName}! Your account is ready.`);
      navigate('/todos', { replace: true });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the request fails, clear local state so the user is logged out.
    }
    clear();
    queryClient.clear();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  }, [clear, navigate, queryClient]);
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (values: ChangePasswordValues) => {
      const { data } = await api.patch<AuthPayload>('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return data.data.user;
    },
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
