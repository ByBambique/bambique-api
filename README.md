# Bambique API

API para el manejo de operaciones con Google Sheets construida sobre **Fastify** y **TypeScript**.

## Requisitos Previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
npm install
```

## Desarrollo Local

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

El servidor se iniciará por defecto en `http://localhost:3001`.

## Compilación para Producción

Para compilar el código TypeScript a JavaScript en el directorio `./dist`:

```bash
npm run build
npm start
```

## Tooling de Validación y Calidad de Código

El repositorio cuenta con validación automática de código mediante **ESLint**, **Prettier**, **TypeScript** y **Git Hooks (Husky)**.

### Comandos Disponibles

- **Comprobación de Tipos (TypeScript):**
  ```bash
  npm run type-check
  ```
- **Linter (ESLint):**
  ```bash
  npm run lint
  npm run lint:fix
  ```
- **Formateo de Código (Prettier):**
  ```bash
  npm run format
  npm run format:check
  ```

### Automático en Git (Husky Hooks)

- **`pre-commit`**: Al realizar `git commit`, `lint-staged` ejecuta automáticamente ESLint `--fix` y Prettier `--write` sobre los archivos modificados.
- **`pre-push`**: Al realizar `git push`, se ejecuta el suite completo de validación (`type-check`, `lint` y `format:check`). Si alguna validación falla, el push se detendrá automáticamente previniendo subir código inconsistente o con errores.
