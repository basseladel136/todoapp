import { useSessionBootstrap } from '@/hooks/useAuth';

/**
 * Kicks off the one-time session check (/auth/me) on app mount.
 * Route guards render a loader until the check resolves.
 */
export function SessionGate({ children }: { children: React.ReactNode }) {
  useSessionBootstrap();
  return <>{children}</>;
}
