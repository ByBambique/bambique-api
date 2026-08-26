const SheetsService = require('../services/sheetsService');
const { updateColumnGSchema, getRowSchema } = require('../schemas/sheetsSchema');
const env = require('../config/env');

async function guestsRoutes(fastify, options) {
  // GET /get-row/:uuid
  fastify.get('/get-row/:uuid', { schema: getRowSchema }, async (request, reply) => {
    const { uuid } = request.params;
    const auth = fastify.googleAuth;
    const spreadsheetId = env.googleSheetId;

    const rowJson = await SheetsService.getRowByUUID(auth, spreadsheetId, uuid);
    return { success: true, data: rowJson };
  });

  // POST /update-column-g
  fastify.post('/update-column-g', { schema: updateColumnGSchema }, async (request, reply) => {
    const { uuid, count } = request.body;
    const auth = fastify.googleAuth;
    const spreadsheetId = env.googleSheetId;

    await SheetsService.updateCellByUUID(auth, spreadsheetId, uuid, count);
    return { success: true, message: `Column G updated for UUID ${uuid}` };
  });
}

module.exports = guestsRoutes;
