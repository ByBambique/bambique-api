import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { google } from 'googleapis';
import env from '../config/env';

const googleSheetsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: env.keyFilePath,
    scopes: env.scopes,
  });

  fastify.decorate('googleAuth', auth);
  fastify.decorate('googleSheetsService', google.sheets({ version: 'v4', auth }));
};

export default fp(googleSheetsPlugin, {
  name: 'googleSheetsPlugin',
});
