export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  item: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: Pagination;
}

export type TaskStatusFilter = 'all' | 'active' | 'completed';

/** Standard API envelope returned by the backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  details?: Record<string, string[]>;
}
