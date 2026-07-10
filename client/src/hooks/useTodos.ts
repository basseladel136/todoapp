import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiResponse, PaginatedTasks, Task, TaskStatusFilter } from '@/types';

export interface TodoQueryParams {
  search: string;
  status: TaskStatusFilter;
  page: number;
  limit: number;
}

const todoKeys = {
  all: ['todos'] as const,
  list: (params: TodoQueryParams) => [...todoKeys.all, 'list', params] as const,
};

export function useTodos(params: TodoQueryParams) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PaginatedTasks>>('/todos', {
        params: {
          search: params.search || undefined,
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      });
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: string) => {
      const { data } = await api.post<ApiResponse<{ task: Task }>>('/todos', { item });
      return data.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      toast.success('Todo created');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data } = await api.patch<ApiResponse<{ task: Task }>>(`/todos/${id}`, {
        isCompleted,
      });
      return data.data.task;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.all }),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      toast.success('Todo deleted');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
