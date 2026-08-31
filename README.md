# Bambique API

High-performance, modular API for Google Sheets operations built with **Fastify** and **TypeScript**.

---

## English Documentation

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
GOOGLE_SHEET_ID=your_primary_google_sheet_id
GOOGLE_SHEET_ID_2=your_secondary_google_sheet_id
```

Make sure you also place your Google Service Account key file named `credentials.json` in the root directory.

### Running the API

#### Development Mode (with hot reload)

```bash
npm run dev
```

The server will start at `http://localhost:3001`.

#### Production Mode

Compile TypeScript to JavaScript (`./dist`) and run the production server:

```bash
npm run build
npm start
```

### API Endpoints

- **`GET /get-row/:uuid`**: Fetches a guest row by matching UUID.
- **`POST /update-column-g`**: Updates column G for a guest matching UUID (`{ "uuid": "...", "count": 2 }`).
- **`POST /fill-form`**: Appends a new form submission row (`{ "name": "...", "phone": "...", "optionalInvite": "..." }`).

### Development Tooling & Quality Assurance

- **Type Check**: `npm run type-check`
- **Linter**: `npm run lint` / `npm run lint:fix`
- **Formatter**: `npm run format` / `npm run format:check`
- **Git Hooks**: Pre-commit runs `lint-staged`; Pre-push runs `type-check`, `lint`, and `format:check`.

---

## 🇪🇸 Instrucciones en Español

API para la gestión de operaciones con Google Sheets construida sobre **Fastify** y **TypeScript**.

### Requisitos Previos

- **Node.js**: versión 18 o superior
- **npm**: versión 9 o superior

### Instalación de Dependencias

```bash
npm install
```

### Configuración del Entorno

1. Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
PORT=3001
GOOGLE_SHEET_ID=tu_id_de_hoja_de_google_principal
GOOGLE_SHEET_ID_2=tu_id_de_hoja_de_google_secundaria
```

2. Asegúrate de colocar el archivo de credenciales de la cuenta de servicio de Google denominado `credentials.json` en la raíz del proyecto.

### Cómo Correr la API

#### 1. Modo Desarrollo (con recarga automática)

Para ejecutar el servidor localmente observando cambios en tiempo real:

```bash
npm run dev
```

El servidor estará escuchando por defecto en `http://localhost:3001`.

#### 2. Modo Producción (Compilación y Ejecución)

Compila el código fuente TypeScript (`.ts`) a JavaScript empaquetado en el directorio `./dist` y arranca el servidor:

```bash
npm run build
npm start
```

### Documentación de Endpoints

- **`GET /get-row/:uuid`**: Obtiene los datos del invitado buscando por el UUID especificado en la hoja de cálculo.
- **`POST /update-column-g`**: Actualiza el valor de la columna G para la fila que coincida con el `uuid`.
  - _Cuerpo JSON:_ `{ "uuid": "string", "count": 2 }`
- **`POST /fill-form`**: Agrega una nueva fila al formulario con los datos ingresados.
  - _Cuerpo JSON:_ `{ "name": "Nombre", "phone": "123456789", "optionalInvite": "Opcional" }`

### Herramientas de Calidad de Código y Validación

El repositorio cuenta con validación automática previa a commits y pushes usando **Husky**:

- **Verificación de Tipos (TypeScript):** `npm run type-check`
- **Linter (ESLint):** `npm run lint` / `npm run lint:fix`
- **Formateo (Prettier):** `npm run format` / `npm run format:check`
- **Git Hooks:**
  - `pre-commit`: Formatea y corrige automáticamente el código modificado con `lint-staged`.
  - `pre-push`: Ejecuta la suite de verificación completa (`type-check`, `lint` y `format:check`). Si alguna prueba falla, cancela la subida.
