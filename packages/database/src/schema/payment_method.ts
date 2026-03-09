import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { jsonb, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user';

const app = pgSchema('app');

export const paymentMethod = app.table('payment_method', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  type: text('type').notNull(),
  channelCode: text('channel_code').notNull(),
  externalId: text('external_id').notNull(),
  status: text('status').default('PENDING').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
export const PaymentMethodSelectSchema = createSelectSchema(paymentMethod);
export const PaymentMethodInsertSchema = v.omit(createInsertSchema(paymentMethod), ['id']);
export const PaymentMethodUpdateSchema = v.omit(createUpdateSchema(paymentMethod), ['id']);
