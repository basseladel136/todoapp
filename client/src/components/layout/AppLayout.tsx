import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

/** Shared shell: navbar + routed page content. */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
