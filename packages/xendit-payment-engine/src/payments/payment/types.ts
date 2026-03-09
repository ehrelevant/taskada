import * as v from "valibot";

import {
    CancelPaymentRequestSchema,
    CancelPaymentResponseSchema,
    CapturePaymentRequestSchema,
    CapturePaymentResponseSchema,
    CaptureSchema,
    GetPaymentStatusRequestSchema,
    GetPaymentStatusResponseSchema,
    PaymentSchema,
} from "./schema";

export type Payment = v.InferInput<typeof PaymentSchema>;
export type CancelPaymentResponse = v.InferInput<typeof CancelPaymentResponseSchema>;
export type CapturePaymentResponse = v.InferInput<typeof CapturePaymentResponseSchema>;
export type GetPaymentStatusRequest = v.InferInput<typeof GetPaymentStatusRequestSchema>;
export type GetPaymentStatusResponse = v.InferInput<typeof GetPaymentStatusResponseSchema>;
export type Capture = v.InferInput<typeof CaptureSchema>;
export type CancelPaymentStatusRequest = v.InferInput<typeof CancelPaymentRequestSchema>;
export type CapturePaymentRequest = v.InferInput<typeof CapturePaymentRequestSchema>;
