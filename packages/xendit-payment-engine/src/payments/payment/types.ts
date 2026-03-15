import * as z from 'zod';

import {
  CancelPaymentRequestSchema,
  CancelPaymentResponseSchema,
  CapturePaymentRequestSchema,
  CapturePaymentResponseSchema,
  CaptureSchema,
  GetPaymentStatusRequestSchema,
  GetPaymentStatusResponseSchema,
  PaymentSchema,
} from './schema';

export type Payment = z.infer<typeof PaymentSchema>;
export type CancelPaymentResponse = z.infer<typeof CancelPaymentResponseSchema>;
export type CapturePaymentResponse = z.infer<typeof CapturePaymentResponseSchema>;
export type GetPaymentStatusRequest = z.input<typeof GetPaymentStatusRequestSchema>;
export type GetPaymentStatusResponse = z.infer<typeof GetPaymentStatusResponseSchema>;
export type Capture = z.infer<typeof CaptureSchema>;
export type CancelPaymentRequest = z.input<typeof CancelPaymentRequestSchema>;
export type CapturePaymentRequest = z.input<typeof CapturePaymentRequestSchema>;
