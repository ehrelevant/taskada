import * as z from 'zod';

export const JSONField: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JSONField),
    z.record(JSONField, JSONField),
  ]),
);
