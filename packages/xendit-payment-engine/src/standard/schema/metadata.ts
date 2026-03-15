import * as z from 'zod';

export const MetadataSchema = z
  .record(z.string().max(40, { error: "Metadata key '${k}' must be at most 40 characters" }), z.string().max(500))
  .nullable()
  .optional()
  .superRefine((obj, ctx) => {
    if (!obj) return;
    const keys = Object.keys(obj);
    if (keys.length > 50) {
      ctx.addIssue({ code: 'custom', message: 'Metadata can contain at most 50 keys' });
    }
  })
  .describe(
    'Key-value entries for your custom data/information. You can specify up to 50 keys, with key names up to 40 characters and values up to 500 characters. This is commonly used for your internal reconciliation purposes. Xendit will not use this data for any processing.',
  );
