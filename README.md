# Bambique API

High-performance, modular API for Google Sheets operations and Ticketing Platform backend built with **Fastify**, **TypeScript**, and **Drizzle ORM** (PostgreSQL).

---

## English Documentation

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **Docker / Docker Desktop**: (Optional, for local PostgreSQL instance)

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bambique_db
GOOGLE_SHEET_ID=your_primary_google_sheet_id
GOOGLE_SHEET_ID_2=your_secondary_google_sheet_id
```

Make sure you also place your Google Service Account key file named `credentials.json` in the root directory if using Google Sheets integrations.

### Database Setup & Management (PostgreSQL + Drizzle ORM)

#### 1. Start Local PostgreSQL with Docker

Make sure **Docker Desktop** is open, then run:

```bash
# Start PostgreSQL container in background
npm run docker:db

# Stop PostgreSQL container
npm run docker:db:down

# View container logs
npm run docker:db:logs
```

#### 2. Apply Database Schema & Migrations

Push the schema directly to PostgreSQL or generate/apply SQL migrations:

```bash
# Push schema directly to database (recommended for dev)
npm run db:push

# Generate new migration files from TypeScript schema
npm run db:generate

# Apply pending migration files
npm run db:migrate
```

#### 3. Manage & Inspect Database

- **Drizzle Studio (Web UI)**:

  ```bash
  npm run db:studio
  ```

  Opens `https://local.drizzle.studio` directly in your browser.

- **DBeaver Connection**:
  - **Host**: `localhost`
  - **Port**: `5432`
  - **Database**: `bambique_db`
  - **Username**: `postgres`
  - **Password**: `postgres`

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

API modular de alto rendimiento para la gestión de operaciones con Google Sheets y Backend de Plataforma de Ticketing construida sobre **Fastify**, **TypeScript** y **Drizzle ORM** (PostgreSQL).

### Requisitos Previos

- **Node.js**: versión 18 o superior
- **npm**: versión 9 o superior
- **Docker / Docker Desktop**: (Opcional, para levantar PostgreSQL localmente)

### Instalación de Dependencias

```bash
npm install
```

### Configuración del Entorno

1. Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example`):

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bambique_db
GOOGLE_SHEET_ID=tu_id_de_hoja_de_google_principal
GOOGLE_SHEET_ID_2=tu_id_de_hoja_de_google_secundaria
```

2. Si vas a utilizar la integración de Google Sheets, coloca el archivo `credentials.json` de la cuenta de servicio de Google en la raíz del proyecto.

### Configuración y Manejo de Base de Datos (PostgreSQL + Drizzle ORM)

#### 1. Iniciar PostgreSQL localmente con Docker

Abre **Docker Desktop** y ejecuta:

```bash
# Iniciar el contenedor de PostgreSQL en segundo plano
npm run docker:db

# Detener el contenedor de PostgreSQL
npm run docker:db:down

# Ver los logs del contenedor
npm run docker:db:logs
```

#### 2. Crear y Sincronizar Tablas en PostgreSQL

Crea automáticamente todas las tablas, relaciones y enums sin necesidad de copiar scripts SQL a mano:

```bash
# Sincronizar el esquema TypeScript directamente a la BD (recomendado en desarrollo)
npm run db:push

# Generar archivos de migración SQL a partir del esquema
npm run db:generate

# Aplicar migraciones pendientes
npm run db:migrate
```

#### 3. Visualizar y Administrar la Base de Datos

- **Drizzle Studio (Panel visual web integrado)**:

  ```bash
  npm run db:studio
  ```

  Abre `https://local.drizzle.studio` en tu navegador para ver y editar registros visualmente.

- **Conexión en DBeaver**:
  - **Host:** `localhost`
  - **Puerto (Port):** `5432`
  - **Base de Datos (Database):** `bambique_db`
  - **Usuario (Username):** `postgres`
  - **Contraseña (Password):** `postgres`

### Cómo Correr la API

#### 1. Modo Desarrollo (con recarga automática)

```bash
npm run dev
```

El servidor estará escuchando por defecto en `http://localhost:3001`.

#### 2. Modo Producción (Compilación y Ejecución)

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
  - `pre-push`: Ejecuta la suite de verificación completa (`type-check`, `lint` y `format:check`).
