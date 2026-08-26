const fp = require('fastify-plugin');
const { google } = require('googleapis');
const env = require('../config/env');

async function googleSheetsPlugin(fastify, options) {
  const auth = new google.auth.GoogleAuth({
    keyFile: env.keyFilePath,
    scopes: env.scopes,
  });

  fastify.decorate('googleAuth', auth);
  fastify.decorate('googleSheetsService', google.sheets({ version: 'v4', auth }));
}

module.exports = fp(googleSheetsPlugin, {
  name: 'googleSheetsPlugin',
});
