import { z } from 'zod';

export const XENDIT_SECRET_KEY = z.string('Missing XENDIT_SECRET_KEY').parse(process.env.XENDIT_SECRET_KEY);

export const GOOGLE_MAPS_API_KEY = z.string('Missing GOOGLE_MAPS_API_KEY').parse(process.env.GOOGLE_MAPS_API_KEY);

export const AWS_REGION = z.string('Missing AWS_REGION').parse(process.env.AWS_REGION);

export const AWS_ACCESS_KEY_ID = z.string('Missing AWS_ACCESS_KEY_ID').parse(process.env.AWS_ACCESS_KEY_ID);

export const AWS_SECRET_ACCESS_KEY = z.string('Missing AWS_SECRET_ACCESS_KEY').parse(process.env.AWS_SECRET_ACCESS_KEY);

export const S3_BUCKET_NAME = z.string('Missing S3_BUCKET_NAME').parse(process.env.S3_BUCKET_NAME);

export const S3_PUBLIC_URL = z.string().optional().parse(process.env.S3_PUBLIC_URL);

export const GRAFANA_LOKI_URL = z.string().optional().parse(process.env.GRAFANA_LOKI_URL);

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3300',
  'http://localhost:3200',
  'http://localhost:3100',
  'provider-app://',
  'seeker-app://',
] as const;

export const CORS_ORIGINS = z
  .string()
  .default(DEFAULT_CORS_ORIGINS.join(','))
  .optional()
  .transform(origins => origins?.split(',').map(o => o.trim()))
  .parse(process.env.CORS_ORIGINS);
