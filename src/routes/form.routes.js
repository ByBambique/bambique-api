const SheetsService = require('../services/sheetsService');
const { fillFormSchema } = require('../schemas/sheetsSchema');
const env = require('../config/env');

async function formRoutes(fastify, options) {
  // POST /fill-form
  fastify.post('/fill-form', { schema: fillFormSchema }, async (request, reply) => {
    const { name, phone, optionalInvite } = request.body;
    const auth = fastify.googleAuth;
    const spreadsheetId = env.googleSheetId;
    const range = 'pagina1!A1';

    await SheetsService.appendRow(auth, spreadsheetId, range, [name, phone, optionalInvite || '']);
    return { success: true, message: 'Form submitted successfully' };
  });
}

module.exports = formRoutes;
