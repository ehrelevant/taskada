import { z } from 'zod';

export const XENDIT_SECRET_KEY = z.string().parse(process.env.XENDIT_SECRET_KEY);

export const GOOGLE_MAPS_API_KEY = z.string().parse(process.env.GOOGLE_MAPS_API_KEY);

export const AWS_REGION = z.string().parse(process.env.AWS_REGION);

export const AWS_ACCESS_KEY_ID = z.string().parse(process.env.AWS_ACCESS_KEY_ID);

export const AWS_SECRET_ACCESS_KEY = z.string().parse(process.env.AWS_SECRET_ACCESS_KEY);

export const S3_BUCKET_NAME = z.string().parse(process.env.S3_BUCKET_NAME);

export const S3_PUBLIC_URL = z.string().optional().parse(process.env.S3_PUBLIC_URL);
