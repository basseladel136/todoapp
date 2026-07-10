import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { taskSchema, type TaskValues } from '@/schemas/task.schema';
import { useCreateTodo } from '@/hooks/useTodos';

export function QuickAddTodo() {
  const create = useCreateTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { item: '' },
  });

  const onSubmit = (values: TaskValues) =>
    create.mutate(values.item, { onSuccess: () => reset() });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5" noValidate>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            {...register('item')}
            placeholder="Add a new todo…"
            aria-label="New todo"
            aria-invalid={!!errors.item}
            data-testid="new-todo"
          />
        </div>
        <Button type="submit" disabled={create.isPending} data-testid="submit-newTask">
          {create.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
      {errors.item && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {errors.item.message}
        </p>
      )}
    </form>
  );
}
