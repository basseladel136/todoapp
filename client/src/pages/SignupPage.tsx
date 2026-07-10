import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { AuthCard } from '@/components/layout/AuthCard';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signupSchema, type SignupValues } from '@/schemas/auth.schema';
import { useSignup } from '@/hooks/useAuth';

export function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signup = useSignup();

  const onSubmit = (values: SignupValues) => signup.mutate(values);

  return (
    <AuthCard
      title="Register to Application"
      description="Ready to mark some Todos as completed?"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="signup-firstName"
            label="First name"
            autoComplete="given-name"
            data-testid="first-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <FormField
            id="signup-lastName"
            label="Last name"
            autoComplete="family-name"
            data-testid="last-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <FormField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          data-testid="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          data-testid="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormField
          id="signup-confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          data-testid="confirm-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={signup.isPending}
          data-testid="submit"
        >
          {signup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {signup.isPending ? 'Creating account…' : 'Signup'}
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
            data-testid="go-login"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
