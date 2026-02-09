import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingSwaggerDto {
  @ApiProperty({
    description: 'The ID of the request this booking is for',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  requestId: string;

  @ApiProperty({
    description: 'The ID of the service being booked',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  serviceId: string;
}
