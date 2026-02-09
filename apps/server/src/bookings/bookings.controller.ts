import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { BookingUpdateSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { BookingsService } from './bookings.service';

import { CreateBookingSwaggerDto } from './dto/create-booking.dto';
import { SubmitProposalDto } from './dto/submit-proposal.dto';
import { UpdateBookingSwaggerDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getBookings(@Query('requestId') requestId?: string, @Query('seekerUserId') seekerUserId?: string) {
    return await this.bookingsService.getBookings(requestId, seekerUserId);
  }

  @Get('history')
  async getBookingHistory(@Session() { user }: UserSession) {
    return await this.bookingsService.getBookingHistory(user.id, 'seeker');
  }

  @Get('provider/history')
  async getProviderBookingHistory(@Session() { user }: UserSession) {
    return await this.bookingsService.getBookingHistory(user.id, 'provider');
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return await this.bookingsService.getBookingById(id);
  }

  @Post()
  async createBooking(@Session() { user }: UserSession, @Body() createBookingDto: CreateBookingSwaggerDto) {
    // The provider is the current authenticated user
    return await this.bookingsService.createBooking(user.id, createBookingDto.requestId, createBookingDto.serviceId);
  }

  @Patch(':id')
  @UsePipes(new ValibotPipe(BookingUpdateSchema))
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateBookingSwaggerDto) {
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

  @Get(':id/request-details')
  async getBookingRequestDetails(@Session() { user }: UserSession, @Param('id') id: string) {
    return await this.bookingsService.getBookingRequestDetails(id, user.id);
  }

  @Get(':id/chat-logs')
  async getBookingChatLogs(@Session() { user }: UserSession, @Param('id') id: string) {
    return await this.bookingsService.getBookingChatLogs(id, user.id);
  }
}
