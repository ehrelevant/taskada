import {
  pgSchema,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { user} from "./user"

const app = pgSchema('app');

export const seeker = app.table('seeker', {
  userId: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
});
export const SeekerSelectSchema = createSelectSchema(seeker);
export const SeekerInsertSchema = createInsertSchema(seeker);
export const SeekerUpdateSchema = createUpdateSchema(seeker);