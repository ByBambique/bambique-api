import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  googleClientId?: string;
  googleSheetId: string;
  googleSheetId2?: string;
  keyFilePath: string;
  scopes: string[];
}

export const env: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'bambique-super-secret-jwt-key-2026',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  googleSheetId2: process.env.GOOGLE_SHEET_ID_2,
  keyFilePath: path.join(__dirname, '../../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
};

export default env;
