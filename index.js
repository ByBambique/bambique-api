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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
