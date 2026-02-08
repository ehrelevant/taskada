import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { BookingUpdateSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import { SubmitProposalDto } from './dto/submit-proposal.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getBookings(@Query('requestId') requestId?: string, @Query('seekerUserId') seekerUserId?: string) {
    return await this.bookingsService.getBookings(requestId, seekerUserId);
  }

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

  @Patch(':id/proposal')
  async submitProposal(
    @Session() { user }: UserSession,
    @Param('id') id: string,
    @Body() submitProposalDto: SubmitProposalDto,
  ) {
    return await this.bookingsService.submitProposal(
      user.id,
      id,
      submitProposalDto.cost,
      submitProposalDto.specifications,
    );
  }
}
