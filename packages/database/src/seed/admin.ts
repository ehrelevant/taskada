import { eq } from 'drizzle-orm';
import { hashSync } from 'bcrypt';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../schema';
import { account } from '../schema/auth';
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_PHONE } from '../env';
import { user, userRole } from '../schema/app';

export async function seedAdmin(db: NodePgDatabase<typeof schema>): Promise<void> {
  const email = SEED_ADMIN_EMAIL;
  const phone = SEED_ADMIN_PHONE;
  const password = SEED_ADMIN_PASSWORD;

  if (!email || !phone || !password) {
    console.log('[seed] Admin: skipped (SEED_ADMIN_EMAIL, SEED_ADMIN_PHONE, SEED_ADMIN_PASSWORD not set)');
    return;
  }

  console.log('[seed] Seeding admin user...');

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);

  if (existing.length > 0) {
    console.log('[seed] Admin: skipped (user already exists)');
    return;
  }

  const [newUser] = await db
    .insert(user)
    .values({
      email,
      phoneNumber: phone,
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
    })
    .returning({ id: user.id });

  await db.insert(userRole).values({
    userId: newUser.id,
    role: 'admin',
  });

  await db.insert(account).values({
    userId: newUser.id,
    providerId: 'credential',
    accountId: email,
    password: hashSync(password, 10),
  });

  console.log(`[seed] Admin: created user ${newUser.id}`);
}
