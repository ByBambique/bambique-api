import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SheetsService } from '../services/sheetsService';
import { updateColumnGSchema, getRowSchema } from '../schemas/sheetsSchema';
import env from '../config/env';

interface GetRowParams {
  uuid: string;
}

interface UpdateColumnGBody {
  uuid: string;
  count: number | string;
}

const guestsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /get-row/:uuid
  fastify.get<{ Params: GetRowParams }>(
    '/get-row/:uuid',
    { schema: getRowSchema },
    async (request) => {
      const { uuid } = request.params;
      const auth = fastify.googleAuth;
      const spreadsheetId = env.googleSheetId;

      const rowJson = await SheetsService.getRowByUUID(auth, spreadsheetId, uuid);
      return { success: true, data: rowJson };
    }
  );

  // POST /update-column-g
  fastify.post<{ Body: UpdateColumnGBody }>(
    '/update-column-g',
    { schema: updateColumnGSchema },
    async (request) => {
      const { uuid, count } = request.body;
      const auth = fastify.googleAuth;
      const spreadsheetId = env.googleSheetId;

      await SheetsService.updateCellByUUID(auth, spreadsheetId, uuid, count);
      return { success: true, message: `Column G updated for UUID ${uuid}` };
    }
  );
};

export default guestsRoutes;
