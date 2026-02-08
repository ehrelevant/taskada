import { address, booking, request, service, serviceType, user } from '@repo/database';
import { and, eq } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ChatGateway } from '../chat/chat.gateway';
import { DatabaseService } from '../database/database.service';
import { MatchingGateway } from '../matching/matching.gateway';

import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly chatGateway: ChatGateway,
    private readonly matchingGateway: MatchingGateway,
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
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
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

    if (providerInfo) {
      // Notify seeker about new booking via push notification
      await this.chatGateway.broadcastNewBooking(newBooking.id, seekerUserId, providerInfo);

      // Notify seeker via WebSocket that their request is being settled
      await this.matchingGateway.notifyRequestSettling(requestId, newBooking.id, providerInfo);
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

  async submitProposal(providerId: string, bookingId: string, cost: number, specifications: string) {
    // Verify booking exists and provider is the owner
    const [bookingRecord] = await this.dbService.db
      .select()
      .from(booking)
      .where(and(eq(booking.id, bookingId), eq(booking.providerUserId, providerId)))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found or you are not the provider');
    }

    // Update booking with cost and specifications
    const [updated] = await this.dbService.db
      .update(booking)
      .set({ cost, specifications })
      .where(eq(booking.id, bookingId))
      .returning();

    // Get service type info for notification
    const [serviceInfo] = await this.dbService.db
      .select({
        serviceTypeName: serviceType.name,
      })
      .from(service)
      .innerJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .where(eq(service.id, bookingRecord.serviceId))
      .limit(1);

    // Get provider info for notification
    const [providerInfo] = await this.dbService.db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, providerId))
      .limit(1);

    // Get seeker's address
    const seekerAddress = await this.getSeekerAddress(bookingRecord.seekerUserId, bookingId);

    // Notify seeker about proposal via WebSocket
    await this.chatGateway.broadcastProposalSubmitted(bookingId, bookingRecord.seekerUserId, providerInfo, {
      cost,
      specifications,
      serviceTypeName: serviceInfo?.serviceTypeName || 'Service',
      address: seekerAddress,
    });

    return updated;
  }

  private async getSeekerAddress(seekerUserId: string, bookingId: string) {
    // Get the request associated with this booking to find the address
    const [addressRecord] = await this.dbService.db
      .select({
        label: address.label,
        coordinates: address.coordinates,
      })
      .from(request)
      .innerJoin(address, eq(request.addressId, address.id))
      .innerJoin(booking, eq(request.seekerUserId, booking.seekerUserId))
      .where(eq(booking.id, bookingId))
      .orderBy(request.createdAt)
      .limit(1);

    return addressRecord;
  }

  async getBookings(requestId?: string, seekerUserId?: string) {
    // Base query with provider info
    const baseQuery = this.dbService.db
      .select({
        id: booking.id,
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
        serviceId: booking.serviceId,
        status: booking.status,
        cost: booking.cost,
        createdAt: booking.createdAt,
        provider: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(booking)
      .leftJoin(user, eq(booking.providerUserId, user.id));

    if (requestId) {
      // Need to join with request table to filter by requestId
      const bookingsWithRequest = await this.dbService.db
        .select({
          id: booking.id,
          providerUserId: booking.providerUserId,
          seekerUserId: booking.seekerUserId,
          serviceId: booking.serviceId,
          status: booking.status,
          cost: booking.cost,
          createdAt: booking.createdAt,
          requestId: request.id,
        })
        .from(booking)
        .innerJoin(request, eq(booking.seekerUserId, request.seekerUserId))
        .where(eq(request.id, requestId));

      // Get provider info for each booking
      const bookingsWithProvider = await Promise.all(
        bookingsWithRequest.map(async b => {
          const [provider] = await this.dbService.db
            .select({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              avatarUrl: user.avatarUrl,
            })
            .from(user)
            .where(eq(user.id, b.providerUserId))
            .limit(1);
          return { ...b, provider };
        }),
      );

      return bookingsWithProvider;
    }

    if (seekerUserId) {
      // Execute query with where clause for seekerUserId
      const results = await this.dbService.db
        .select({
          id: booking.id,
          providerUserId: booking.providerUserId,
          seekerUserId: booking.seekerUserId,
          serviceId: booking.serviceId,
          status: booking.status,
          cost: booking.cost,
          createdAt: booking.createdAt,
          provider: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
          },
        })
        .from(booking)
        .leftJoin(user, eq(booking.providerUserId, user.id))
        .where(eq(booking.seekerUserId, seekerUserId));

      return results;
    }

    return await baseQuery;
  }
}
