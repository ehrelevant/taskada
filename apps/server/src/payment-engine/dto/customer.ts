import {
  CreateCustomerRequestSchema,
  CreateCustomerResponseSchema,
  GetCustomerListRequestSchema,
  GetCustomerListResponseSchema,
  GetCustomerRequestSchema,
  GetCustomerResponseSchema,
  UpdateCustomerRequestSchema,
  UpdateCustomerResponseSchema,
} from '@repo/xendit-payment-engine';
import { createStandardDto } from '@mag123c/nestjs-stdschema';

export class GetCustomerRequestDto extends createStandardDto(GetCustomerRequestSchema) {}
export class CreateCustomerRequestDto extends createStandardDto(CreateCustomerRequestSchema) {}
export class UpdateCustomerRequestDto extends createStandardDto(UpdateCustomerRequestSchema) {}
export class GetCustomerListRequestDto extends createStandardDto(GetCustomerListRequestSchema) {}
export class GetCustomerListResponseDto extends createStandardDto(GetCustomerListResponseSchema) {}
export class CreateCustomerResponseDto extends createStandardDto(CreateCustomerResponseSchema) {}
export class GetCustomerResponseDto extends createStandardDto(GetCustomerResponseSchema) {}
export class UpdateCustomerResponseDto extends createStandardDto(UpdateCustomerResponseSchema) {}
