import { parse, string } from 'valibot';

export const XENDIT_SECRET_KEY = parse(string(), process.env.XENDIT_SECRET_KEY);

export const GOOGLE_MAPS_API_KEY = parse(string(), process.env.GOOGLE_MAPS_API_KEY);
