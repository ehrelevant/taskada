import { boolean, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

import { agency } from './agency';
import { user } from './user';

const app = pgSchema('app');

export const provider = app.table('provider', {
  userId: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  agencyId: uuid('agency_id').references(() => agency.id, { onUpdate: 'cascade', onDelete: 'set null' }),
  isAccepting: boolean('is_accepting').notNull().default(false),
});
export const ProviderSelectSchema = createSelectSchema(provider);
export const ProviderInsertSchema = createInsertSchema(provider);
export const ProviderUpdateSchema = createUpdateSchema(provider);
