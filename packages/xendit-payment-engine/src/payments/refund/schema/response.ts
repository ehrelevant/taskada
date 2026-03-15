import * as z from 'zod';

export const CreateRefundResponseSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Xendit unique Refund ID generated as reference after creation of refund.' }),
    payment_request_id: z.string().min(1).max(255).meta({
      description: 'Xendit unique Payment Request ID generated as reference after creation of payment request.',
    }),
    payment_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'To be deprecated. Xendit unique Payment ID generated as reference for a payment.' }),
    invoice_id: z.string().min(1).max(255).meta({
      description:
        'To be deprecated. Xendit unique Invoice ID generated as reference after creation of an invoice or payment link.',
    }),
    payment_method_type: z
      .enum(['CARD', 'EWALLET', 'DIRECT_DEBIT'])
      .meta({ description: 'To be deprecated. Type of the payment method used in the original payment.' }),
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'A Reference ID from merchants to identify their request.' }),
    channel_code: z.string().meta({ description: 'Channel code used to select the payment method provider.' }),
    currency: z
      .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD', 'HKD', 'AUD', 'GBP', 'EUR', 'JPY', 'MXN'])
      .meta({ description: 'ISO 4217 three-letter currency code for the payment.' }),
    amount: z.number().min(0).meta({ description: 'The intended payment amount to be refunded to the end user.' }),
    status: z.enum(['SUCCEEDED', 'FAILED', 'PENDING', 'CANCELLED']).meta({ description: 'Status of the refund.' }),
    reason: z
      .enum(['FRAUDULENT', 'DUPLICATE', 'REQUESTED_BY_CUSTOMER', 'CANCELLATION', 'OTHERS'])
      .meta({ description: 'Status of the refund.' }),
    failure_code: z
      .enum(['ACCOUNT_ACCESS_BLOCKED', 'ACCOUNT_NOT_FOUND', 'DUPLICATE_ERROR', 'INSUFFICIENT_BALANCE', 'REFUND_FAILED'])
      .optional(),
    refund_fee_amount: z.number().meta({ description: 'Fee for processing the refund.' }),
    metadata: z.record(z.string().max(40), z.string().max(500)).meta({ description: 'Custom metadata' }),
    created: z.string().meta({ description: 'ISO 8601 date-time format.' }),
    updated: z.string().meta({ description: 'ISO 8601 date-time format.' }),
  })
  .meta({ description: 'Create refund response', example: [{ id: 'rfd-...' }] });
