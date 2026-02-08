import { parse, string } from 'valibot';

export const API_URL = parse(string(), process.env.EXPO_PUBLIC_API_URL);

export const GOOGLE_MAPS_API_KEY = parse(string(), process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);