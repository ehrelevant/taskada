import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderSwaggerDto {
  @ApiProperty({
    description: 'The user ID of the provider',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Optional agency ID if the provider belongs to an agency',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  agencyId?: string;

  @ApiProperty({
    description: 'Whether the provider is currently accepting new requests',
    example: true,
    required: false,
  })
  isAccepting?: boolean;
}
