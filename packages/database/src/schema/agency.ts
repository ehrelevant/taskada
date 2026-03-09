import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

const app = pgSchema('app');

export const agency = app.table('agency', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
});
export const AgencySelectSchema = createSelectSchema(agency);
export const AgencyInsertSchema = v.omit(createInsertSchema(agency), ['id']);
export const AgencyUpdateSchema = v.omit(createUpdateSchema(agency), ['id']);
