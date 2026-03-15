import {
  GetPaymentRequestStatusRequestSchema,
  GetPaymentRequestStatusResponseSchema,
  CancelPaymentRequestRequestSchema,
  CancelPaymentRequestResponseSchema,
  SimulatePaymentRequestSchema,
  SimulatePaymentResponseSchema,
} from '@repo/xendit-payment-engine';

import { Exclude } from 'class-transformer';
import { createStandardDto } from '@mag123c/nestjs-stdschema';

export class GetPaymentRequestStatusRequestDto extends createStandardDto(GetPaymentRequestStatusRequestSchema) {}
export class GetPaymentRequestStatusResponseDto extends createStandardDto(GetPaymentRequestStatusResponseSchema) {}

export class CancelPaymentRequestRequestDto extends createStandardDto(CancelPaymentRequestRequestSchema) {}
export class CancelPaymentRequestResponseDto extends createStandardDto(CancelPaymentRequestResponseSchema) {}

export class SimulatePaymentRequestDto extends createStandardDto(SimulatePaymentRequestSchema) {
    @Exclude()
    payment_request_id: string
}
export class SimulatePaymentResponseDto extends createStandardDto(SimulatePaymentResponseSchema) {}
