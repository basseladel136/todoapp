import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${env.port} (${env.nodeEnv})`);
});

// Clear, actionable message when the configured port is already taken.
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(
      `❌ Port ${env.port} is already in use. ` +
        `Set a different PORT in server/.env (e.g. PORT=5000) and restart.`
    );
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown.
function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
});
