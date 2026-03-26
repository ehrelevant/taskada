import * as z from 'zod';

export const ErrorResponseSchema = z.object({
  error_code: z.string(),
  message: z.string(),
  errors: z.array(z.union([z.string(), z.record(z.string(), z.any())])).optional(),
});
