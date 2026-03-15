import * as z from 'zod';

const PaymentCaptureStatusWebhookDataSchema = z
  .object({
    business_id: z
      .string()
      .regex(/^[a-zA-Z0-9-]{1,64}$/)
      .meta({
        description: 'Xendit-generated identifier for the business that owns the transaction',
        example: ['5f27a14a9fb05c73dd040bc8'],
      }),
    reference_id: z
      .string()
      .regex(/^[a-zA-Z0-9-]{1,255}$/)
      .meta({
        description:
          'A reference ID from merchants to identify their request. For "CARDS" channel code, reference ID must be unique.',
        example: ['pr-1f02feb0-bb79-47ae-9d1e-e69394d3949c'],
      }),
    payment_request_id: z
      .string()
      .regex(/^pr-[a-zA-Z0-9-]{20,}$/)
      .optional()
      .meta({
        description: 'Xendit unique Payment Request ID generated as reference after creation of payment request.',
        example: ['pr-1f02feb0-bb79-47ae-9d1e-e69394d3949c'],
      }),
    payment_token_id: z
      .string()
      .regex(/^[a-zA-Z0-9-]*$/)
      .meta({
        description:
          'Xendit unique Payment Token ID generated as reference for reusable payment details of the end user.',
        example: ['pt-cc3938dc-c2a5-43c4-89d7-757079348c2b'],
      }),
    customer_id: z
      .string()
      .regex(/^[a-zA-Z0-9-]{3,41}$/)
      .meta({
        description: 'Xendit unique Capture ID generated as reference for the end user',
        example: ['cus-b98d6f63-d240-4ec-9bd5-aa42954c4f48'],
      }),
    type: z
      .enum(['PAY', 'PAY_AND_SAVE', 'REUSABLE_PAYMENT_CODE'])
      .optional()
      .meta({
        description: 'The payment collection intent type for the payment request.',
        example: ['PAY'],
      }),
    country: z
      .enum(['ID', 'PH', 'VN', 'TH', 'SG', 'MY', 'HK', 'MX'])
      .optional()
      .meta({
        description: 'ISO 3166-1 alpha-2 two-letter country code for the country of transaction.',
        example: ['ID'],
      }),
    currency: z
      .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD', 'HKD', 'AUD', 'GBP', 'EUR', 'JPY', 'MXN'])
      .optional()
      .meta({
        description: 'ISO 4217 three-letter currency code for the payment.',
        example: ['IDR'],
      }),
    request_amount: z
      .number()
      .min(0)
      .optional()
      .meta({
        description: 'The intended amount to be collected from the end user.',
        example: [10000.0],
      }),
    capture_method: z
      .enum(['AUTOMATIC', 'MANUAL'])
      .default('AUTOMATIC')
      .optional()
      .meta({
        description:
          "Payment capture will be processed immediately after payment request is created or requires merchant's trigger.",
        example: ['AUTOMATIC'],
      }),
    channel_code: z
      .string()
      .optional()
      .meta({
        description: 'Channel code used to select the payment method provider.',
        example: ['CARD'],
      }),
    channel_properties: z
      .record(z.string(), z.any())
      .optional()
      .meta({
        description: 'Data required to initiate transaction with payment method provider.',
        example: [{}],
      }),
    captures: z
      .array(z.record(z.string(), z.any()))
      .optional()
      .meta({
        description: 'Capture object contains information about the capture that was performed.',
        example: [{}],
      }),
    status: z
      .enum(['AUTHORIZED', 'CANCELED', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'PENDING'])
      .optional()
      .meta({
        description: 'Status of the payment.',
        example: ['SUCCEEDED'],
      }),
    payment_details: z
      .record(z.string(), z.any())
      .optional()
      .meta({
        description: 'Payment information provided by the payment method provider.',
        example: [{}],
      }),
    failure_code: z
      .string()
      .optional()
      .meta({
        description: 'Failure codes for payments.',
        example: ['CARD_DECLINED'],
      }),
    metadata: z
      .record(z.string(), z.any())
      .optional()
      .meta({
        description: 'Key-value entries for your custom data.',
        example: [{ my_custom_id: 'merchant-123', my_custom_order_id: 'order-123' }],
      }),
    created: z
      .string()
      .optional()
      .meta({
        description: 'ISO 8601 date-time format.',
        example: ['2021-12-31T23:59:59Z'],
      }),
    updated: z
      .string()
      .optional()
      .meta({
        description: 'ISO 8601 date-time format.',
        example: ['2021-12-31T23:59:59Z'],
      }),
  })
  .optional()
  .meta({
    description: 'Payment object',
  });

export const PaymentCaptureStatusWebhookSchema = z.object({
  event: z
    .enum(['payment.capture', 'payment.authorization', 'payment.failure'])
    .optional()
    .meta({
      description: 'Webhook event names for payment capture status updates.',
      example: ['payment.capture'],
    }),
  business_id: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .meta({
      description: 'Xendit-generated identifier for the business that owns the transaction',
      example: ['5f27a14a9fb05c73dd040bc8'],
    }),
  created: z
    .string()
    .optional()
    .meta({
      description: 'Timestamp of webhook delivery attempt in ISO 8601 date-time format.',
      example: ['2021-12-31T23:59:59Z'],
    }),
  data: PaymentCaptureStatusWebhookDataSchema,
});
