import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../schema';

import { SERVICE_TYPES } from './data';

export async function seedServiceTypes(db: NodePgDatabase<typeof schema>): Promise<void> {
  console.log('[seed] Seeding service types...');

  let inserted = 0;
  let skipped = 0;

  for (const st of SERVICE_TYPES) {
    const existing = await db
      .select({ id: schema.serviceType.id })
      .from(schema.serviceType)
      .where(eq(schema.serviceType.name, st.name))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(schema.serviceType).values(st);
    inserted++;
  }

  console.log(`[seed] Service types: ${inserted} inserted, ${skipped} skipped`);
}
