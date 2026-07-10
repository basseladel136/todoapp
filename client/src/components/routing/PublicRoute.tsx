import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { FullScreenLoader } from '@/components/FullScreenLoader';

/** Redirects already-authenticated users away from login/signup. */
export function PublicRoute() {
  const { user, isInitializing } = useAuthStore();

  if (isInitializing) return <FullScreenLoader />;
  if (user) return <Navigate to="/todos" replace />;
  return <Outlet />;
}
