import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.ComponentProps<'input'> {
  label: string;
  error?: string;
}

/**
 * Accessible label + input + error message, designed to spread a
 * react-hook-form `register(...)` result via `{...props}` (it forwards the ref).
 */
const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={className}
          {...props}
        />
        {error && (
          <p id={errorId} className={cn('text-sm font-medium text-destructive')} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };
