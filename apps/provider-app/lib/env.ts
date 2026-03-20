import { z } from 'zod';

export const API_URL = z.string().parse(process.env.EXPO_PUBLIC_API_URL);

export const GOOGLE_MAPS_API_KEY = z.string().parse(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
