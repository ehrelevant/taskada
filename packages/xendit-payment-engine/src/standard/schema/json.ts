import * as z from 'zod';

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export const JSONField: z.ZodType<JSONValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(JSONField), z.record(z.string(), JSONField)]),
);
