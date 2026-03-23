import { z } from 'zod';

export const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

export const SEED_ADMIN_EMAIL = z.email().optional().parse(process.env.SEED_ADMIN_EMAIL);
export const SEED_ADMIN_PHONE = z.string().regex(/^\d{10}$/).optional().parse(process.env.SEED_ADMIN_PHONE);
export const SEED_ADMIN_PASSWORD = z.string().min(8).optional().parse(process.env.SEED_ADMIN_PASSWORD);