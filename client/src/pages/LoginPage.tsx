import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { AuthCard } from '@/components/layout/AuthCard';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { loginSchema, type LoginValues } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const login = useLogin();

  const onSubmit = (values: LoginValues) => login.mutate(values);

  return (
    <AuthCard title="Login to Application" description="Ready to mark some Todos as completed?">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          data-testid="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          data-testid="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={login.isPending}
          data-testid="submit"
        >
          {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {login.isPending ? 'Logging in…' : 'Login'}
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
            data-testid="signup"
          >
            Create a new Account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
