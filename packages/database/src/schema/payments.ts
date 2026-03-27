import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { jsonb, pgEnum, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
export const PaymentMethodInsertSchema = createInsertSchema(paymentMethod).omit({ id: true });
export const PaymentMethodUpdateSchema = createUpdateSchema(paymentMethod).omit({ id: true });

export const paymentAuditLogEnum = pgEnum('payment_audit_log_types', ['SESSION_SAVE', 'SESSION_PAY', 'PAYMENT']);
export const paymentAuditLog = app.table('payment_audit_log', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  type: paymentAuditLogEnum('type').notNull(),
  externalId: text('external_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const PaymentAuditLogUpdateSchema =createUpdateSchema(paymentAuditLog).omit({
  id: true,
  userId: true,
  createdAt:true,
  updatedAt: true,
});
