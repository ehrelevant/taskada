import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

const app = pgSchema('app');

export const agency = app.table('agency', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
});
export const AgencySelectSchema = createSelectSchema(agency);
export const AgencyInsertSchema = createInsertSchema(agency).omit({ id: true });
export const AgencyUpdateSchema = createUpdateSchema(agency).omit({ id: true });
