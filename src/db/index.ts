import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import env from '../config/env';

const connectionString = env.databaseUrl || process.env.DATABASE_URL || '';

// Connection for queries
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
export default db;
