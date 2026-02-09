import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceSwaggerDto {
  @ApiProperty({
    description: 'The ID of the service type',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  serviceTypeId: string;

  @ApiProperty({
    description: 'The user ID of the provider offering this service',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  providerUserId: string;

  @ApiProperty({
    description: 'Initial cost estimate for the service',
    example: 1500.0,
  })
  initialCost: number;

  @ApiProperty({
    description: 'Whether the service is currently enabled and available',
    example: true,
    required: false,
  })
  isEnabled?: boolean;
}
