import * as z from 'zod';

import { PaymentRequestObjectSchema } from './object';

export const SimulatePaymentResponseSchema = z.object({
  status: z.enum(['PENDING']).meta({
    description: 'Status of a simulation will always be PENDING',
    example: ['PENDING'],
  }),
  message: z.string().meta({
    description:
      'A simulated payment for the specified payment request id is being processed. You will be informed of the result via a webhook.',
  }),
});

export const CreatePaymentRequestResponseSchema = PaymentRequestObjectSchema;
export const CancelPaymentRequestResponseSchema = PaymentRequestObjectSchema;
export const GetPaymentRequestStatusResponseSchema = PaymentRequestObjectSchema;
