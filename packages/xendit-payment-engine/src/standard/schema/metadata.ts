import * as v from 'valibot';

export const MetadataSchema = v.optional(
  v.nullable(
    v.pipe(
      v.record(v.pipe(v.string(), v.maxLength(40)), v.pipe(v.string(), v.maxLength(500))),
      v.description(
        'Key-value entries for your custom data/information. You can specify up to 50 keys, with key names up to 40 characters and values up to 500 characters. This is commonly used for your internal reconciliation purposes. Xendit will not use this data for any processing.',
      ),
    ),
  ),
);
