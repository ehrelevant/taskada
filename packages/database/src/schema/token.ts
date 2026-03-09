import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user';

const app = pgSchema('app');

export const pushToken = app.table('push_token', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  token: text('token').notNull(),
  platform: text('platform').notNull(), // 'ios' or 'android'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const PushTokenSelectSchema = createSelectSchema(pushToken);
export const PushTokenInsertSchema = v.omit(createInsertSchema(pushToken), ['id', 'createdAt', 'updatedAt']);
export const PushTokenUpdateSchema = v.omit(createUpdateSchema(pushToken), ['id', 'createdAt', 'updatedAt']);
