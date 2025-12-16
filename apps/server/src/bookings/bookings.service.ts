import { and, eq } from 'drizzle-orm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { booking, service } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createBooking(providerId: string, requestId: string, serviceId: string) {
    // Verify service belongs to provider
    const [providerService] = await this.dbService.db
    .select()
    .from(service)
    .where(and(eq(service.id, serviceId), eq(service.providerUserId, providerId)));

    if (!providerService) throw new BadRequestException('Invalid service provided');

    // Insert booking
    const [newBooking] = await this.dbService.db.insert(booking).values({
      providerUserId: providerId,
      requestId: requestId,
      serviceId: serviceId,
      seekerUserId: '...fetch from request...', // Simplified: In real app, fetch seeker from request
      status: 'accepted',
      cost: providerService.initialCost
    }).returning();

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