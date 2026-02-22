import { optional, parse, string } from 'valibot';

export const XENDIT_SECRET_KEY = parse(string(), process.env.XENDIT_SECRET_KEY);

export const GOOGLE_MAPS_API_KEY = parse(string(), process.env.GOOGLE_MAPS_API_KEY);

export const AWS_REGION = parse(string(), process.env.AWS_REGION);

export const AWS_ACCESS_KEY_ID = parse(string(), process.env.AWS_ACCESS_KEY_ID);

export const AWS_SECRET_ACCESS_KEY = parse(string(), process.env.AWS_SECRET_ACCESS_KEY);

export const S3_BUCKET_NAME = parse(string(), process.env.S3_BUCKET_NAME);

export const S3_PUBLIC_URL = parse(optional(string()), process.env.S3_PUBLIC_URL);
