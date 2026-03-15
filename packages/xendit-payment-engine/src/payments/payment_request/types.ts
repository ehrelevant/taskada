import * as z from 'zod';

import {
  CancelPaymentRequestRequestSchema,
  CancelPaymentRequestResponseSchema,
  CreatePaymentRequestResponseSchema,
  GetPaymentRequestStatusRequestSchema,
  GetPaymentRequestStatusResponseSchema,
  PaymentCaptureStatusWebhookSchema,
  PaymentRequestObjectSchema,
  PaymentRequestPayRequestSchema,
  PaymentRequestPaySaveRequestSchema,
  PaymentRequestPayTokenRequestSchema,
  PaymentRequestReusablePaymentCodeRequestSchema,
  SimulatePaymentRequestSchema,
  SimulatePaymentResponseSchema,
} from './schema';

export type CancelPaymentRequestRequest = z.input<typeof CancelPaymentRequestRequestSchema>;
export type CancelPaymentRequestResponse = z.infer<typeof CancelPaymentRequestResponseSchema>;
export type CreatePaymentRequestResponse = z.infer<typeof CreatePaymentRequestResponseSchema>;
export type GetPaymentRequestStatusRequest = z.input<typeof GetPaymentRequestStatusRequestSchema>;
export type GetPaymentRequestStatusResponse = z.infer<typeof GetPaymentRequestStatusResponseSchema>;
export type PaymentCaptureStatusWebhook = z.infer<typeof PaymentCaptureStatusWebhookSchema>;
export type PaymentRequestObject = z.infer<typeof PaymentRequestObjectSchema>;
export type SimulatePaymentRequest = z.input<typeof SimulatePaymentRequestSchema>;
export type SimulatePaymentResponse = z.infer<typeof SimulatePaymentResponseSchema>;

export type PaymentRequestPayRequest = z.input<typeof PaymentRequestPayRequestSchema>;
export type PaymentRequestPaySaveRequest = z.input<typeof PaymentRequestPaySaveRequestSchema>;
export type PaymentRequestPayTokenRequest = z.input<typeof PaymentRequestPayTokenRequestSchema>;
export type PaymentRequestReusablePaymentCodeRequest = z.input<typeof PaymentRequestReusablePaymentCodeRequestSchema>;
