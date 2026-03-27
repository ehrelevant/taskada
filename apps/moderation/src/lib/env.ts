import { z } from 'zod'

export const API_URL = z
  .string()
  .default('http://localhost:3000')
  .parse(import.meta.env.VITE_API_URL)
