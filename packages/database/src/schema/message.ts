import * as v from 'valibot';
import {
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

import { booking } from "./booking"
import { user } from "./user"

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
export const MessageInsertSchema = v.omit(createInsertSchema(message), ['id', 'createdAt', 'updatedAt']);
export const MessageUpdateSchema = v.omit(createUpdateSchema(message), ['id', 'createdAt', 'updatedAt']);

export const messageImage = app.table('message_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  messageId: uuid('message_id')
    .notNull()
    .references(() => message.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export const MessageImageSelectSchema = createSelectSchema(messageImage);
export const MessageImageInsertSchema = v.omit(createInsertSchema(messageImage), ['id']);
export const MessageImageUpdateSchema = v.omit(createUpdateSchema(messageImage), ['id']);