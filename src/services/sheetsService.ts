import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export interface GuestRow {
  guestName: string | null;
  amount: string | null;
  prob: string | null;
  guid: string | null;
  rel: string | null;
  link: string | null;
  confirmedNumber: string | null;
  gener: string | null;
}

export class SheetsService {
  /**
   * Append a row to the specified spreadsheet range
   */
  static async appendRow(
    auth: GoogleAuth,
    spreadsheetId: string,
    range: string,
    values: (string | number)[]
  ) {
    const service = google.sheets({ version: 'v4', auth });
    const resource = { values: [values] };
    const response = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: resource,
    });
    return response.data;
  }

  /**
   * Update cell in Column G by matching UUID in Column D (index 3)
   */
  static async updateCellByUUID(
    auth: GoogleAuth,
    spreadsheetId: string,
    uuid: string,
    newValue: string | number
  ) {
    const service = google.sheets({ version: 'v4', auth });
    const range = 'invitados!A:G';
    const res = await service.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      const error = new Error('No data found in sheet') as Error & { statusCode?: number };
      error.statusCode = 404;
      throw error;
    }

    const rowIndex = rows.findIndex((r: string[]) => r[3] === uuid);
    if (rowIndex === -1) {
      const error = new Error(`UUID not found: ${uuid}`) as Error & { statusCode?: number };
      error.statusCode = 404;
      throw error;
    }

    const updateRange = `invitados!G${rowIndex + 1}`;
    const resource = { values: [[newValue]] };
    return await service.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: resource,
    });
  }

  /**
   * Get row by UUID and return mapped object
   */
  static async getRowByUUID(
    auth: GoogleAuth,
    spreadsheetId: string,
    uuid: string
  ): Promise<GuestRow> {
    const service = google.sheets({ version: 'v4', auth });
    const range = 'invitados!A:H';
    const res = await service.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      const error = new Error('No data found in sheet') as Error & { statusCode?: number };
      error.statusCode = 404;
      throw error;
    }

    const row = rows.find((r: string[]) => r[3] === uuid);
    if (!row) {
      const error = new Error(`UUID not found in sheet: ${uuid}`) as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      throw error;
    }

    const headers = [
      'guestName',
      'amount',
      'prob',
      'guid',
      'rel',
      'link',
      'confirmedNumber',
      'gener',
    ];
    const rowJson: Record<string, string | null> = {};
    headers.forEach((key, idx) => {
      rowJson[key] = row[idx] || null;
    });

    return rowJson as unknown as GuestRow;
  }
}

export default SheetsService;
