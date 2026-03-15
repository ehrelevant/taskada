import * as z from 'zod';

export const CaptureSchema = z
  .object({
    capture_timestamp: z.string().meta({ description: 'ISO 8601 date-time format.' }),
    capture_id: z
      .string()
      .min(1)
      .max(255)
      .meta({
        description: 'Xendit unique Capture ID generated as reference for a single capture.',
        example: 'cap-...',
      }),
    capture_amount: z
      .number()
      .min(0)
      .meta({ description: 'The payment amount captured for this payment.', example: 10000.0 }),
  })
  .meta({ description: 'Capture object', example: [{ capture_id: 'cap-...', capture_amount: 10000.0 }] });
