import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { pgEnum, pgSchema, timestamp, uuid } from 'drizzle-orm/pg-core';

import { provider } from './provider';
import { request } from './request';
import { service } from './service';

const app = pgSchema('app');

export const interestStatusEnum = pgEnum('interest_status', ['pending', 'accepted', 'rejected']);

export const providerInterest = app.table('provider_interest', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => request.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  status: interestStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const ProviderInterestSelectSchema = createSelectSchema(providerInterest);
export const ProviderInterestInsertSchema = createInsertSchema(providerInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const ProviderInterestUpdateSchema = createUpdateSchema(providerInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
