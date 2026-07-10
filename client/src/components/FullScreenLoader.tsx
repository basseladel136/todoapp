import { Loader2 } from 'lucide-react';

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
