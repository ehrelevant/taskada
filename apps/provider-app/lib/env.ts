import { parse, string } from 'valibot';

export const API_URL = parse(string(), process.env.EXPO_PUBLIC_API_URL);
