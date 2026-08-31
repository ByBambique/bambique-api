import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SheetsService } from '../services/sheetsService';
import { fillFormSchema } from '../schemas/sheetsSchema';
import env from '../config/env';

interface FillFormBody {
  name: string;
  phone: string | number;
  optionalInvite?: string | number | null;
}

const formRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /fill-form
  fastify.post<{ Body: FillFormBody }>(
    '/fill-form',
    { schema: fillFormSchema },
    async (request) => {
      const { name, phone, optionalInvite } = request.body;
      const auth = fastify.googleAuth;
      const spreadsheetId = env.googleSheetId;
      const range = 'pagina1!A1';

      await SheetsService.appendRow(auth, spreadsheetId, range, [
        name,
        phone,
        optionalInvite || '',
      ]);
      return { success: true, message: 'Form submitted successfully' };
    }
  );
};

export default formRoutes;
