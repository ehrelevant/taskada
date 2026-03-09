import * as v from 'valibot';
import {
  pgEnum,
  pgSchema,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

import {request } from "./request"
import {provider } from "./provider"
import {service } from "./service"

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
export const ProviderInterestInsertSchema = v.omit(createInsertSchema(providerInterest), [
  'id',
  'createdAt',
  'updatedAt',
]);
export const ProviderInterestUpdateSchema = v.omit(createUpdateSchema(providerInterest), [
  'id',
  'createdAt',
  'updatedAt',
]);
