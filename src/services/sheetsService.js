const { google } = require('googleapis');

class SheetsService {
  /**
   * Añadir una fila a la hoja de cálculo
   */
  static async appendRow(auth, spreadsheetId, range, values) {
    const service = google.sheets({ version: 'v4', auth });
    const resource = { values: [values] };
    const response = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource,
    });
    return response.data;
  }

  /**
   * Actualizar columna G buscando por UUID en columna D (índice 3)
   */
  static async updateCellByUUID(auth, spreadsheetId, uuid, newValue) {
    const service = google.sheets({ version: 'v4', auth });
    const range = 'invitados!A:G';
    const res = await service.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      const error = new Error('No data found in sheet');
      error.statusCode = 404;
      throw error;
    }

    const rowIndex = rows.findIndex(r => r[3] === uuid); // columna D/E = índice 3
    if (rowIndex === -1) {
      const error = new Error(`UUID not found: ${uuid}`);
      error.statusCode = 404;
      throw error;
    }

    const updateRange = `invitados!G${rowIndex + 1}`;
    const resource = { values: [[newValue]] };
    return await service.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      resource,
    });
  }

  /**
   * Obtener fila por UUID y retornar objeto mapeado
   */
  static async getRowByUUID(auth, spreadsheetId, uuid) {
    const service = google.sheets({ version: 'v4', auth });
    const range = 'invitados!A:H';
    const res = await service.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      const error = new Error('No data found in sheet');
      error.statusCode = 404;
      throw error;
    }

    const row = rows.find(r => r[3] === uuid);
    if (!row) {
      const error = new Error(`UUID not found in sheet: ${uuid}`);
      error.statusCode = 404;
      throw error;
    }

    const headers = ['guestName', 'amount', 'prob', 'guid', 'rel', 'link', 'confirmedNumber', 'gener'];
    const rowJson = {};
    headers.forEach((key, idx) => {
      rowJson[key] = row[idx] || null;
    });

    return rowJson;
  }
}

module.exports = SheetsService;
