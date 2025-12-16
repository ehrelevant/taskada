import { ApiProperty } from '@nestjs/swagger';
import { type BookingStatus, NewBooking } from '@repo/database';

export class CreateBookingDto implements NewBooking {
  @ApiProperty()
  providerUserId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  seekerUserId: string;

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  status: BookingStatus;

  @ApiProperty()
  cost: number;
}
