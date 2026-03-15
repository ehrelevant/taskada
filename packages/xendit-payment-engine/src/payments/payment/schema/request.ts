import * as z from 'zod';

const PaymentIdRequestSchema = z.object({
  payment_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{39}$/)
    .meta({ example: 'py-cc3938dc-c2a5-43c4-89d7-7570793348c2' }),
});

export const GetPaymentStatusRequestSchema = PaymentIdRequestSchema;
export const CapturePaymentRequestSchema = z
  .object({
    capture_amount: z.number().meta({ description: 'The payment amount captured for this payment.', example: 10000.0 }),
    payment_id: PaymentIdRequestSchema.shape.payment_id,
  })
  .meta({ description: 'Capture payment request' });
export const CancelPaymentRequestSchema = PaymentIdRequestSchema;
