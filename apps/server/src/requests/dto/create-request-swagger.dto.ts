import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestSwaggerDto {
  @ApiProperty({
    description: 'The ID of the service type for this request',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  serviceTypeId: string;

  @ApiProperty({
    description: 'Optional specific service ID if requesting a particular provider',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  serviceId?: string;

  @ApiProperty({
    description: 'Description of the service request',
    example: 'I need help fixing my kitchen sink that is leaking',
  })
  description: string;

  @ApiProperty({
    description: 'Latitude coordinate of the service location',
    example: 14.5995,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate of the service location',
    example: 120.9842,
  })
  longitude: number;

  @ApiProperty({
    description: 'Label/name of the address',
    example: '123 Main St, Manila',
  })
  addressLabel: string;

  @ApiProperty({
    description: 'Optional array of image URLs for the request',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  imageUrls?: string[];
}
