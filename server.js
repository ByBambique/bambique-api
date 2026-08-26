const buildApp = require('./src/app');
const env = require('./src/config/env');

const app = buildApp({ logger: true });

const start = async () => {
  try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server running on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  });
});

start();
