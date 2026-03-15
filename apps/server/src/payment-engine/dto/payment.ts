import {
  CancelPaymentRequestSchema,
  CancelPaymentResponseSchema,
  CapturePaymentRequestSchema,
  CapturePaymentResponseSchema,
  CaptureSchema,
  CreateRefundRequestSchema,
  CreateRefundResponseSchema,
  GetPaymentStatusRequestSchema,
  GetPaymentStatusResponseSchema,
  PaymentSchema,
} from '@repo/xendit-payment-engine';
import { createStandardDto } from '@mag123c/nestjs-stdschema';

export class CancelPaymentRequestDto extends createStandardDto(CancelPaymentRequestSchema) {}
export class CancelPaymentResponseDto extends createStandardDto(CancelPaymentResponseSchema) {}
export class CapturePaymentRequestDto extends createStandardDto(CapturePaymentRequestSchema) {}
export class CapturePaymentResponseDto extends createStandardDto(CapturePaymentResponseSchema) {}
export class CaptureDto extends createStandardDto(CaptureSchema) {}
export class GetPaymentStatusRequestDto extends createStandardDto(GetPaymentStatusRequestSchema) {}
export class GetPaymentStatusResponseDto extends createStandardDto(GetPaymentStatusResponseSchema) {}
export class PaymentDto extends createStandardDto(PaymentSchema) {}
export class CreateRefundRequestDto extends createStandardDto(CreateRefundRequestSchema) {}
export class CreateRefundResponseDto extends createStandardDto(CreateRefundResponseSchema) {}
