import {
  CancelPayoutRequestSchema,
  CancelPayoutResponseSchema,
  CreatePayoutRequestSchema,
  CreatePayoutResponseSchema,
  GetPaymentChannelsRequestSchema,
  GetPaymentChannelsResponseSchema,
  GetPayoutRequestSchema,
  GetPayoutResponseSchema,
  ListPayoutsRequestSchema,
  ListPayoutsResponseSchema,
} from '@repo/xendit-payment-engine';

import { createStandardDto } from '@mag123c/nestjs-stdschema';

export class CancelPayoutRequestDto extends createStandardDto(CancelPayoutRequestSchema) {}
export class CancelPayoutResponseDto extends createStandardDto(CancelPayoutResponseSchema) {}
export class CreatePayoutRequestDto extends createStandardDto(CreatePayoutRequestSchema) {}
export class CreatePayoutResponseDto extends createStandardDto(CreatePayoutResponseSchema) {}
export class GetPaymentChannelsRequestDto extends createStandardDto(GetPaymentChannelsRequestSchema) {}
export class GetPaymentChannelsResponseDto extends createStandardDto(GetPaymentChannelsResponseSchema) {}
export class GetPayoutRequestDto extends createStandardDto(GetPayoutRequestSchema) {}
export class GetPayoutResponseDto extends createStandardDto(GetPayoutResponseSchema) {}
export class ListPayoutsRequestDto extends createStandardDto(ListPayoutsRequestSchema) {}
export class ListPayoutsResponseDto extends createStandardDto(ListPayoutsResponseSchema) {}
