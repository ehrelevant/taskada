import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CancelSessionRequestSchema,
  CancelSessionResponseSchema,
  CreateSessionRequestSchema,
  CreateSessionResponseSchema,
  GetSessionStatusRequestSchema,
  GetSessionStatusResponseSchema,
} from '@repo/xendit-payment-engine';
import type { ChannelPropertiesPay } from '@repo/xendit-payment-engine';
import { createStandardDto } from '@mag123c/nestjs-stdschema';

export class CancelSessionRequestDto extends createStandardDto(CancelSessionRequestSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}
export class CancelSessionResponseDto extends createStandardDto(CancelSessionResponseSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}

export class CreateSessionRequestDto extends createStandardDto(CreateSessionRequestSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}
export class CreateSessionResponseDto extends createStandardDto(CreateSessionResponseSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}
export class GetSessionStatusRequestDto extends createStandardDto(GetSessionStatusRequestSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}
export class GetSessionStatusResponseDto extends createStandardDto(GetSessionStatusResponseSchema) {
  @ApiPropertyOptional({
    oneOf: [{ $ref: '#/components/schemas/payer_name_only' }, { $ref: '#/components/schemas/cards' }],
    discriminator: { propertyName: 'channel_type' },
  })
  channel_properties?: ChannelPropertiesPay;
}
