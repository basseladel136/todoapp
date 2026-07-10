import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, User as UserIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth.store';
import { useChangePassword } from '@/hooks/useAuth';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/schemas/auth.schema';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = (values: ChangePasswordValues) =>
    changePassword.mutate(values, { onSuccess: () => reset() });

  if (!user) return null;
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="normal-case">Profile</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Full name">
              {user.firstName} {user.lastName}
            </InfoRow>
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email">
              {user.email}
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="normal-case">Change password</CardTitle>
          <CardDescription>
            Use at least 8 characters with upper &amp; lower case, a number and a special
            character.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              id="currentPassword"
              label="Current password"
              type="password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <FormField
              id="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <FormField
              id="confirmNewPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword')}
            />
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {changePassword.isPending ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 break-words text-sm">{children}</p>
    </div>
  );
}
