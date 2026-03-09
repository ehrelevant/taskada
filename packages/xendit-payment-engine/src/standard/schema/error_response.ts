import * as v from 'valibot';

export const ErrorResponseSchema = v.object({
  error_code: v.string(),
  message: v.string(),
  errors: v.array(v.union([v.string(), v.object({})])),
});
