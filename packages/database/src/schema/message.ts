import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { booking } from './booking';
import { user } from './user';

const app = pgSchema('app');

export const message = app.table('message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => booking.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const MessageSelectSchema = createSelectSchema(message);
export const MessageInsertSchema = createInsertSchema(message).omit({ id: true, createdAt: true, updatedAt: true });
export const MessageUpdateSchema = createUpdateSchema(message).omit({ id: true, createdAt: true, updatedAt: true });

export const messageImage = app.table('message_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  messageId: uuid('message_id')
    .notNull()
    .references(() => message.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export const MessageImageSelectSchema = createSelectSchema(messageImage);
export const MessageImageInsertSchema = createInsertSchema(messageImage).omit({ id: true });
export const MessageImageUpdateSchema = createUpdateSchema(messageImage).omit({ id: true });
