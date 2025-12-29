import { Body, Controller, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { BookingUpdateSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Session() { user }: UserSession, @Body() createBookingDto: CreateBookingDto) {
    // The provider is the current authenticated user
    return await this.bookingsService.createBooking(user.id, createBookingDto.requestId, createBookingDto.serviceId);
  }

  @Patch(':id')
  @UsePipes(new ValibotPipe(BookingUpdateSchema))
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateBookingDto) {
    return await this.bookingsService.updateBooking(id, {
      status: updateStatusDto.status,
    });
  }
}
