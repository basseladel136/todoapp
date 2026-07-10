import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { FullScreenLoader } from '@/components/FullScreenLoader';

/** Gates routes that require an authenticated session. */
export function ProtectedRoute() {
  const { user, isInitializing } = useAuthStore();

  if (isInitializing) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
