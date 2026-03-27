import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { numeric, pgEnum, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { provider } from './provider';
import { seeker } from './seeker';
import { service } from './service';

const app = pgSchema('app');

export const bookingStatusEnum = pgEnum('booking_status', ['in_transit', 'serving', 'completed', 'cancelled']);

export const booking = app.table('booking', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  seekerUserId: uuid('seeker_id')
    .notNull()
    .references(() => seeker.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  status: bookingStatusEnum('status').notNull().default('in_transit'),
  cost: numeric('cost', { mode: 'number', precision: 10, scale: 2 }).notNull().default(0),
  specifications: text('specifications'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const BookingSelectSchema = createSelectSchema(booking);
export const BookingInsertSchema = createInsertSchema(booking).omit({ id: true, createdAt: true, updatedAt: true });
export const BookingUpdateSchema = createUpdateSchema(booking).omit({ id: true, createdAt: true, updatedAt: true });
