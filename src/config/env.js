const path = require('path');
require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleSheetId2: process.env.GOOGLE_SHEET_ID_2,
  keyFilePath: path.join(__dirname, '../../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
};

module.exports = env;
