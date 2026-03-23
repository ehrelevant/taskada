import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schema';
import { DATABASE_URL } from '../env';

import { seedAdmin } from './admin';
import { seedServiceTypes } from './service-types';

async function main() {
  const connectionString = DATABASE_URL;

  if (!connectionString) {
    console.error('[seed] DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema, casing: 'snake_case' });

  console.log('[seed] Starting...');

  await seedServiceTypes(db);
  await seedAdmin(db);

  await pool.end();
  console.log('[seed] Done');
}

main().catch(err => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
