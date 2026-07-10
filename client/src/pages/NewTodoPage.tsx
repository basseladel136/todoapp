import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { taskSchema, type TaskValues } from '@/schemas/task.schema';
import { useCreateTodo } from '@/hooks/useTodos';

export function NewTodoPage() {
  const navigate = useNavigate();
  const create = useCreateTodo();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { item: '' },
  });

  const onSubmit = (values: TaskValues) =>
    create.mutate(values.item, { onSuccess: () => navigate('/todos') });

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle data-testid="header">Create a new Todo</CardTitle>
          <CardDescription data-testid="sub-header">
            Ready to mark some Todos as completed?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              id="new-todo-item"
              label="Todo item"
              data-testid="new-todo"
              error={errors.item?.message}
              {...register('item')}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={create.isPending}
              data-testid="submit-newTask"
            >
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {create.isPending ? 'Creating…' : 'Create Todo'}
            </Button>
            <Separator />
            <Button variant="ghost" className="w-full" asChild data-testid="back">
              <Link to="/todos">
                <ArrowLeft className="h-4 w-4" />
                Go back to your Todos
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
