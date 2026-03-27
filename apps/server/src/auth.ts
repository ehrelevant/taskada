import 'dotenv/config';
import * as schema from '@repo/database';
import { betterAuth } from 'better-auth';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { expo } from '@better-auth/expo';
import { Pool } from 'pg';

import { CORS_ORIGINS } from './env';

const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema, casing: 'snake_case' });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    debugLogs: false,
  }),
  plugins: [expo()],
  trustedOrigins: CORS_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      name: 'firstName',
      image: 'avatarUrl',
    },
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: true,
        input: true,
      },
      middleName: {
        type: 'string',
        required: false,
        input: true,
      },
      lastName: {
        type: 'string',
        required: true,
        input: true,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
