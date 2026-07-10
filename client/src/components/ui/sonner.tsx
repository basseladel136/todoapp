import { Toaster as SonnerToaster } from 'sonner';

/** App-wide toast host. Uses the dark theme to match the UI. */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'font-mono',
        },
      }}
    />
  );
}
