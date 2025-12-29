import { parse, string } from 'valibot';

export const XENDIT_SECRET_KEY = parse(string(), process.env.XENDIT_SECRET_KEY);
