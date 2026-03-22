import { z } from 'zod'

export const API_URL = z
  .url()
  .default('http://localhost:3000')
  .parse(process.env.API_URL)
