import { ApiProperty } from '@nestjs/swagger';
import { type BookingStatus } from '@repo/database';

export class UpdateBookingSwaggerDto {
  @ApiProperty({
    description: 'The status of the booking',
    enum: ['in_transit', 'serving', 'completed', 'cancelled'],
    example: 'serving',
  })
  status: BookingStatus;
}
