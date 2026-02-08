import { and, eq } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { booking, request, service, user } from '@repo/database';

import { ChatGateway } from '../chat/chat.gateway';
import { DatabaseService } from '../database/database.service';

import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly chatGateway: ChatGateway,
  ) {}

  private async getSeekerIdFromRequest(requestId: string) {
    const [requestRecord] = await this.dbService.db
      .select({ seekerUserId: request.seekerUserId })
      .from(request)
      .where(eq(request.id, requestId))
      .limit(1);

    if (!requestRecord) {
      throw new NotFoundException('Request not found');
    }

    return requestRecord.seekerUserId;
  }

  async createBooking(providerId: string, requestId: string, serviceId: string) {
    // Verify service belongs to provider
    const [providerService] = await this.dbService.db
      .select()
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.providerUserId, providerId)));

    if (!providerService) throw new BadRequestException('Invalid service provided');

    // Fetch seekerUserId from the request
    const seekerUserId = await this.getSeekerIdFromRequest(requestId);

    // Get provider info for notification
    const [providerInfo] = await this.dbService.db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .from(user)
      .where(eq(user.id, providerId))
      .limit(1);

    // Insert booking
    const [newBooking] = await this.dbService.db
      .insert(booking)
      .values({
        providerUserId: providerId,
        serviceId: serviceId,
        seekerUserId: seekerUserId,
        status: 'in_transit',
        cost: providerService.initialCost,
      })
      .returning();

    // Notify seeker about new booking via push notification
    if (providerInfo) {
      await this.chatGateway.broadcastNewBooking(newBooking.id, seekerUserId, providerInfo);
    }

    return newBooking;
  }

  async updateBooking(bookingId: string, updateBookingDto: UpdateBookingDto) {
    const [updated] = await this.dbService.db
      .update(booking)
      .set(updateBookingDto)
      .where(eq(booking.id, bookingId))
      .returning();
    return updated;
  }
}
