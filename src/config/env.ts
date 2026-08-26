import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  googleSheetId: string;
  googleSheetId2?: string;
  keyFilePath: string;
  scopes: string[];
}

export const env: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  googleSheetId2: process.env.GOOGLE_SHEET_ID_2,
  keyFilePath: path.join(__dirname, '../../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
};

export default env;
