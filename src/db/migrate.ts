import postgres from 'postgres';
import env from '../config/env';

export async function runMigrations() {
  const sql = postgres(env.databaseUrl, { max: 1 });

  try {
    await sql`DO $$ BEGIN
      CREATE TYPE "user_role" AS ENUM('super_admin', 'admin', 'organizer', 'user');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`;

    await sql`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;`;
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "user_role" DEFAULT 'user' NOT NULL;`;
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" varchar(255) UNIQUE;`;
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_url" text;`;

    console.log('✅ Base de datos actualizada con las columnas de autenticación');
  } catch (err) {
    console.error('Error aplicando migración:', err);
    throw err;
  } finally {
    await sql.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
