const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const KEYFILEPATH = path.join(__dirname, 'credentials.json');

// Autentica usando una cuenta de servicio
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  return auth.getClient();
}

// // Función para añadir una fila a la hoja de cálculo
async function appendRow(auth, spreadsheetId, range, values) {
  const service = google.sheets({version: 'v4', auth});
  console.log('DEBUG: spreadsheetId:', spreadsheetId, 'range:', range, 'values:', values)

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

async function updateCellByUUID(auth, spreadsheetId, uuid, newValue) {
  const service = google.sheets({ version: 'v4', auth });

  // Obtener columnas A a G (o hasta donde necesites)
  const range = 'invitados!A:G';
  const res = await service.spreadsheets.values.get({ spreadsheetId, range });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    throw new Error('No data found in sheet');
  }

  // Buscar la fila donde columna E (índice 4) sea igual al UUID
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][3] === uuid) { // columna E = índice 4
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error('UUID not found in column E');
  }

  // Actualizar la columna que quieras, por ejemplo G (índice 6)
  const updateRange = `invitados!G${rowIndex + 1}`; // Sheets es 1-based
  const resource = { values: [[newValue]] };

  const updateRes = await service.spreadsheets.values.update({
    spreadsheetId,
    range: updateRange,
    valueInputOption: 'RAW',
    resource,
  });

  return updateRes.data;
}

app.post('/update-column-g', async (req, res) => {
  const { uuid, count } = req.body;
  const auth = await authenticate();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    await updateCellByUUID(auth, spreadsheetId, uuid, count);
    res.status(200).send(`Column G updated for UUID ${uuid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


app.post('/fill-form', async (req, res) => {
  const { name, phone, optionalInvite } = req.body;
  const auth = await authenticate();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID; // ID de la hoja de cálculo
  const range = 'pagina1!A1'; // Rango de la hoja, puedes ajustar esto

  try {
    const result = await appendRow(auth, spreadsheetId, range, [name, phone, optionalInvite]);
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting the form');
  }
});

// const auth = new google.auth.GoogleAuth({
//   keyFile: './credentials.json',
//   scopes: ['https://www.googleapis.com/auth/spreadsheets']
// });

// async function test() {
//   const client = await auth.getClient();
//   const sheets = google.sheets({ version: 'v4', auth: client });

//   const spreadsheetId = '1W8m-wQN2AGe8LXs6-jmzci75uSGMTvNGKJOMTBmuYgo';
//   const res = await sheets.spreadsheets.get({ spreadsheetId });
//   console.log(res.data);
// }

// test().catch(console.error);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
