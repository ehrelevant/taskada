import * as z from 'zod';

export const CreateRefundRequestSchema = z
  .object({
    payment_request_id: z
      .string()
      .min(1)
      .max(255)
      .meta({
        description: 'Xendit unique Payment Request ID generated as reference after creation of payment request.',
        example: 'pr-xxxxxxxx',
      }),
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'A Reference ID from merchants to identify their request.' }),
    currency: z
      .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD', 'HKD', 'AUD', 'GBP', 'EUR', 'JPY', 'MXN'])
      .meta({ description: 'ISO 4217 three-letter currency code for the payment.' }),
    amount: z.number().min(0).meta({ description: 'The intended payment amount to be refunded to the end user.' }),
    reason: z
      .enum(['FRAUDULENT', 'DUPLICATE', 'REQUESTED_BY_CUSTOMER', 'CANCELLATION', 'OTHERS'])
      .meta({ description: 'Status of the refund.' }),
    metadata: z
      .record(z.string().max(40), z.string().max(500))
      .optional()
      .meta({ description: 'Custom metadata', example: [{}] }),
  })
  .meta({ description: 'Create refund request', example: [{ payment_request_id: 'pr-...', amount: 100 }] });
