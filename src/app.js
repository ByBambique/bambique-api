const Fastify = require('fastify');
const cors = require('@fastify/cors');
const googleSheetsPlugin = require('./plugins/googleSheetsPlugin');
const guestsRoutes = require('./routes/guests.routes');
const formRoutes = require('./routes/form.routes');

function buildApp(opts = {}) {
  const fastify = Fastify({
    logger: opts.logger ?? true,
    ajv: {
      customOptions: {
        allowUnionTypes: true,
      },
    },
  });

  // Registración de CORS
  fastify.register(cors, {
    origin: '*',
  });

  // Registración de Plugins
  fastify.register(googleSheetsPlugin);

  // Registración de Rutas
  fastify.register(guestsRoutes);
  fastify.register(formRoutes);

  // Manejador global de 404 (Ruta no encontrada)
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Route not found' });
  });

  // Manejador global de errores (500 / errores no capturados)
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;
    reply.status(statusCode).send({ error: message });
  });

  return fastify;
}

module.exports = buildApp;
