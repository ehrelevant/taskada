import { pgEnum, boolean, check, pgSchema, primaryKey, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

import { roleEnum } from './role';

const app = pgSchema('app');

export const banStatusEnum = pgEnum('ban_status', ['active', 'suspended', 'banned']);
export type BanStatus = (typeof banStatusEnum.enumValues)[number];

export const user = app.table(
  'user',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    email: text('email').unique().notNull(),
    firstName: text('first_name').notNull().default(''),
    middleName: text('middle_name').notNull().default(''),
    lastName: text('last_name').notNull().default(''),
    phoneNumber: text('phone_number').unique().notNull(),
    avatarUrl: text('avatar_url'),
    emailVerified: boolean('email_verified').notNull().default(false),
    xenditCustomerId: text('xendit_customer_id').unique(),
    banStatus: banStatusEnum('ban_status').notNull().default('active'),
    warningsCount: integer('warnings_count').notNull().default(0),
    suspendedUntil: timestamp('suspended_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ email, phoneNumber }) => [
    check('user_email_non_empty', sql`${email} <> ''`),
    check('user_phone_number_non_empty', sql`${phoneNumber} <> ''`),
  ],
);
export const UserSelectSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user, {
  email: schema => schema.email(),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const UserUpdateSchema = createUpdateSchema(user, {
  email: schema => schema.email(),
}).omit({ id: true, createdAt: true, updatedAt: true });


export const userRole = app.table(
  'user_role',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    role: roleEnum().notNull(),
    assigned_at: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
  },
  ({ userId, role }) => [primaryKey({ columns: [userId, role] })],
);
export const UserRoleSelectSchema = createSelectSchema(userRole);
export const UserRoleInsertSchema = createInsertSchema(userRole).omit({ assigned_at: true });
export const UserRoleUpdateSchema = createUpdateSchema(userRole).omit({ assigned_at: true });



