import { GoogleAuth } from 'google-auth-library';
import { sheets_v4 } from 'googleapis';

declare module 'fastify' {
  interface FastifyInstance {
    googleAuth: GoogleAuth;
    googleSheetsService: sheets_v4.Sheets;
  }
}
