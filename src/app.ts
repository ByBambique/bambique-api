import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import googleSheetsPlugin from './plugins/googleSheetsPlugin';
import guestsRoutes from './routes/guests.routes';
import formRoutes from './routes/form.routes';

export interface BuildAppOptions {
  logger?: boolean;
}

export function buildApp(opts: BuildAppOptions = {}): FastifyInstance {
  const fastify = Fastify({
    logger: opts.logger ?? true,
    ajv: {
      customOptions: {
        allowUnionTypes: true,
      },
    },
  });

  // Register CORS plugin
  fastify.register(cors, {
    origin: '*',
  });

  // Register custom plugins
  fastify.register(googleSheetsPlugin);

  // Register API routes
  fastify.register(guestsRoutes);
  fastify.register(formRoutes);

  // Global 404 Not Found handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Route not found' });
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : (error as Error).message;
    reply.status(statusCode).send({ error: message });
  });

  return fastify;
}

export default buildApp;
