import { useMemo, useState } from 'react';
import { ClipboardList, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { QuickAddTodo } from '@/components/todos/QuickAddTodo';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoItem } from '@/components/todos/TodoItem';
import { Pagination } from '@/components/todos/Pagination';
import { useAuthStore } from '@/stores/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useTodos,
  useToggleTodo,
  useDeleteTodo,
  type TodoQueryParams,
} from '@/hooks/useTodos';
import { getGreeting, getDisplayName } from '@/lib/greeting';
import type { Task, TaskStatusFilter } from '@/types';

const PAGE_SIZE = 5;

export function TodoPage() {
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatusFilter>('all');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const params: TodoQueryParams = useMemo(
    () => ({ search: debouncedSearch, status, page, limit: PAGE_SIZE }),
    [debouncedSearch, status, page]
  );

  const { data, isLoading, isError, refetch, isFetching } = useTodos(params);
  const toggle = useToggleTodo();
  const remove = useDeleteTodo();

  // Reset to page 1 whenever filters change.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleStatusChange = (value: TaskStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleToggle = (todo: Task) =>
    toggle.mutate({ id: todo.id, isCompleted: !todo.isCompleted });
  const handleDelete = (todo: Task) => remove.mutate(todo.id);

  const greeting = `${getGreeting()} ${getDisplayName(user?.firstName)}`;
  const total = data?.pagination.total ?? 0;
  const todos = data?.tasks ?? [];
  const hasFilters = debouncedSearch !== '' || status !== 'all';

  return (
    <div className="container flex justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle data-testid="welcome">{greeting}</CardTitle>
            {!isLoading && (
              <Badge variant="secondary" className="font-mono">
                {total} {total === 1 ? 'todo' : 'todos'}
              </Badge>
            )}
          </div>
          <QuickAddTodo />
          <TodoFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
        </CardHeader>

        <CardContent
          className="space-y-2"
          aria-busy={isFetching}
          data-testid="todo-list"
        >
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not load your todos</AlertTitle>
              <AlertDescription>
                Something went wrong.{' '}
                <button onClick={() => refetch()} className="underline underline-offset-2">
                  Try again
                </button>
              </AlertDescription>
            </Alert>
          ) : todos.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isMutating={toggle.isPending || remove.isPending}
                />
              ))}
              <Pagination
                page={data!.pagination.page}
                totalPages={data!.pagination.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const Icon = hasFilters ? Inbox : ClipboardList;
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
      data-testid="no-todos"
    >
      <Icon className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-semibold">
          {hasFilters ? 'No matching todos' : 'No todos yet'}
        </p>
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? 'Try adjusting your search or filter.'
            : 'Add your first todo above to get started.'}
        </p>
      </div>
    </div>
  );
}
