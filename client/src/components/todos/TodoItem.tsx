import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface TodoItemProps {
  todo: Task;
  onToggle: (todo: Task) => void;
  onDelete: (todo: Task) => void;
  isMutating?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, isMutating }: TodoItemProps) {
  return (
    <div
      data-testid="todo-item"
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
        todo.isCompleted ? 'bg-success/90' : 'bg-primary/90'
      )}
    >
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={() => onToggle(todo)}
        disabled={isMutating}
        aria-label={
          todo.isCompleted ? `Mark "${todo.item}" as active` : `Mark "${todo.item}" as completed`
        }
        className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-success"
      />
      <span
        className={cn(
          'flex-1 break-words text-sm text-primary-foreground',
          todo.isCompleted && 'line-through opacity-80'
        )}
      >
        {todo.item}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo)}
        disabled={isMutating}
        aria-label={`Delete "${todo.item}"`}
        className="h-8 w-8 text-primary-foreground hover:bg-black/20 hover:text-primary-foreground"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
