// // 

// const express = require('express');
// const { google } = require('googleapis');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; // Solo lectura
// const KEYFILEPATH = path.join(__dirname, 'credentials.json');

// // Autentica usando una cuenta de servicio
// async function authenticate() {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: KEYFILEPATH,
//     scopes: SCOPES,
//   });
//   return auth.getClient();
// }

// // Función para obtener datos de la hoja de cálculo
// async function getSheetData(auth) {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = process.env.GOOGLE_SHEET_ID;
//   const range = 'Sheet1';  // Nombre de la hoja o el rango específico

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: range,
//     });
//     return response.data;
//   } catch (err) {
//     console.error('Error getting sheet data:', err);
//     throw err;
//   }
// }

// // Endpoint para obtener datos de la hoja de cálculo
// app.get('/get-sheet-data', async (req, res) => {
//   try {
//     const auth = await authenticate();
//     const data = await getSheetData(auth);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).send('Error getting sheet data');
//   }
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

// const {GoogleAuth} = require('google-auth-library');
// const {google} = require('googleapis');
// const path = require('path');
// require('dotenv').config();

// // Configuración de autenticación
// const auth = new GoogleAuth({
//   keyFile: path.join(__dirname, 'credentials.json'), // Ruta al archivo de credenciales
//   scopes: 'https://www.googleapis.com/auth/spreadsheets',
// });

// // Función para actualizar la hoja de cálculo
// async function batchUpdate(spreadsheetId, title, find, replacement) {
//   const service = google.sheets({version: 'v4', auth});

//   // Configurar las solicitudes
//   const requests = [];
  
//   // Cambiar el título de la hoja de cálculo
//   requests.push({
//     updateSpreadsheetProperties: {
//       properties: {
//         title,
//       },
//       fields: 'title',
//     },
//   });

//   // Buscar y reemplazar texto
//   requests.push({
//     findReplace: {
//       find,
//       replacement,
//       allSheets: true,
//     },
//   });

//   const batchUpdateRequest = {requests};

//   try {
//     const response = await service.spreadsheets.batchUpdate({
//       spreadsheetId,
//       resource: batchUpdateRequest,
//     });

//     const findReplaceResponse = response.data.replies[1]?.findReplace;
//     console.log(`${findReplaceResponse?.occurrencesChanged || 0} replacements made.`);
//     return response;
//   } catch (err) {
//     console.error('Error during batch update:', err);
//     throw err;
//   }
// }

// // Ejemplo de uso
// const spreadsheetId = process.env.GOOGLE_SHEET_ID; // ID de la hoja de cálculo
// const newTitle = 'Nuevo Título'; // Nuevo título para la hoja de cálculo
// const findText = 'Texto a encontrar'; // Texto a buscar
// const replaceText = 'Texto de reemplazo'; // Texto de reemplazo

// batchUpdate(spreadsheetId, newTitle, findText, replaceText)
//   .then(response => console.log('Batch update completed:', response.data))
//   .catch(error => console.error('Batch update failed:', error));


const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const path = require('path');
require('dotenv').config();

// Configuración de autenticación
const auth = new GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'), // Ruta al archivo de credenciales
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

// Función para actualizar la hoja de cálculo
async function batchUpdate(spreadsheetId, title, find, replacement) {
  const service = google.sheets({version: 'v4', auth});

  // Configurar las solicitudes
  const requests = [];

  // Cambiar el título de la hoja de cálculo
  requests.push({
    updateSpreadsheetProperties: {
      properties: {
        title,
      },
      fields: 'title',
    },
  });

  // Buscar y reemplazar texto
  requests.push({
    findReplace: {
      find,
      replacement,
      allSheets: true,
    },
  });

  const batchUpdateRequest = {requests};

  try {
    const response = await service.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: batchUpdateRequest,
    });

    const findReplaceResponse = response.data.replies[1]?.findReplace;
    console.log(`${findReplaceResponse?.occurrencesChanged || 0} replacements made.`);
    return response;
  } catch (err) {
    console.error('Error during batch update:', err);
    throw err;
  }
}

// Función para añadir una fila a la hoja de cálculo
async function appendRow(spreadsheetId, range, values) {
  const service = google.sheets({version: 'v4', auth});

  const resource = {
    values: [values],
  };

  try {
    const response = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource,
    });
    console.log('Row added:', response.data);
    return response;
  } catch (err) {
    console.error('Error appending row:', err);
    throw err;
  }
}

// Ejemplo de uso
const spreadsheetId = process.env.GOOGLE_SHEET_ID; // ID de la hoja de cálculo
const newTitle = 'Nuevo Título'; // Nuevo título para la hoja de cálculo
const findText = 'Texto a encontrar'; // Texto a buscar
const replaceText = 'Texto de reemplazo'; // Texto de reemplazo

// Añadir una fila
const range = 'pagina1!A1'; // Rango de la hoja, puedes ajustar esto
const rowValues = ['Valor1', 'Valor2', 'Valor3']; // Valores de la nueva fila

async function main() {
  try {
    await batchUpdate(spreadsheetId, newTitle, findText, replaceText);
    await appendRow(spreadsheetId, range, rowValues);
  } catch (error) {
    console.error('Operation failed:', error);
  }
}

main();
