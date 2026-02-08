import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The ID of the service being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  serviceId: string;

  @ApiProperty({
    description: 'The ID of the booking associated with this review',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  bookingId: string;

  @ApiProperty({
    description: 'The rating from 1 to 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'The review comment/text',
    example: 'Great service! Very professional.',
    required: false,
  })
  comment?: string;
}
