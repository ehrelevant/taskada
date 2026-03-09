import * as v from 'valibot';
import { boolean, numeric, pgSchema, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

import { provider } from './provider';

const app = pgSchema('app');

export const serviceType = app.table('service_type', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
});
export const ServiceTypeSelectSchema = createSelectSchema(serviceType);
export const ServiceTypeInsertSchema = v.omit(createInsertSchema(serviceType), ['id']);
export const ServiceTypeUpdateSchema = v.omit(createUpdateSchema(serviceType), ['id']);

export const service = app.table('service', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceTypeId: uuid('service_type_id')
    .notNull()
    .references(() => serviceType.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  initialCost: numeric('initial_cost', { mode: 'number', precision: 10, scale: 2 }).notNull().default(0),
  isEnabled: boolean('is_enabled').notNull().default(false),
});
export const ServiceSelectSchema = createSelectSchema(service);
export const ServiceInsertSchema = v.omit(createInsertSchema(service), ['id']);
export const ServiceUpdateSchema = v.omit(createUpdateSchema(service), ['id']);
