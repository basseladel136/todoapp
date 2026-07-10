import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Where the dev server proxies /api. Defaults to the backend's default PORT (5000).
  // Override with VITE_DEV_PROXY_TARGET if the backend runs elsewhere.
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'data-vendor': ['@tanstack/react-query', 'axios', 'zustand'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        // Proxy API calls to the backend in dev so cookies are first-party.
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
