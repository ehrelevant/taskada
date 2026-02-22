import { address, booking, message, request, requestImage, review, service, serviceType, user } from '@repo/database';
import { alias } from 'drizzle-orm/pg-core';
import { and, desc, eq, or, sql } from 'drizzle-orm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ChatGateway } from '../chat/chat.gateway';
import { DatabaseService } from '../database/database.service';
import { MatchingGateway } from '../matching/matching.gateway';

import { UpdateBookingSwaggerDto } from './dto/update-booking.dto';

const providerUser = alias(user, 'provider_user');
const seekerUser = alias(user, 'seeker_user');

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

  async updateBooking(bookingId: string, updateBookingDto: UpdateBookingSwaggerDto) {
    const [updated] = await this.dbService.db
      .update(booking)
      .set(updateBookingDto)
      .where(eq(booking.id, bookingId))
      .returning();

    // If status changed to completed, notify seeker
    if (updateBookingDto.status === 'completed' && updated) {
      await this.chatGateway.broadcastBookingCompleted(bookingId, updated.seekerUserId);
    }

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

  async getBookingById(bookingId: string) {
    const [bookingRecord] = await this.dbService.db
      .select({
        id: booking.id,
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
        serviceId: booking.serviceId,
        status: booking.status,
        cost: booking.cost,
        specifications: booking.specifications,
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
      .where(eq(booking.id, bookingId))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    // Get the address for this booking
    const addressData = await this.getSeekerAddress(bookingRecord.seekerUserId, bookingId);

    // Get service rating info
    const [serviceRating] = await this.dbService.db
      .select({
        avgRating: sql`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
        reviewCount: sql`COUNT(DISTINCT ${review.id})`.mapWith(Number),
      })
      .from(review)
      .where(eq(review.serviceId, bookingRecord.serviceId));

    return {
      ...bookingRecord,
      address: addressData,
      serviceRating: {
        avgRating: serviceRating?.avgRating ?? 0,
        reviewCount: serviceRating?.reviewCount ?? 0,
      },
    };
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

  async getBookingHistory(userId: string, role: 'provider' | 'seeker') {
    const whereCondition =
      role === 'provider'
        ? and(eq(booking.providerUserId, userId), or(eq(booking.status, 'completed'), eq(booking.status, 'cancelled')))
        : and(eq(booking.seekerUserId, userId), or(eq(booking.status, 'completed'), eq(booking.status, 'cancelled')));

    const results = await this.dbService.db
      .select({
        id: booking.id,
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
        serviceId: booking.serviceId,
        status: booking.status,
        cost: booking.cost,
        specifications: booking.specifications,
        createdAt: booking.createdAt,
        provider: {
          id: providerUser.id,
          firstName: providerUser.firstName,
          lastName: providerUser.lastName,
          avatarUrl: providerUser.avatarUrl,
        },
        seeker: {
          id: seekerUser.id,
          firstName: seekerUser.firstName,
          lastName: seekerUser.lastName,
          avatarUrl: seekerUser.avatarUrl,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          iconUrl: serviceType.iconUrl,
        },
      })
      .from(booking)
      .leftJoin(providerUser, eq(booking.providerUserId, providerUser.id))
      .leftJoin(seekerUser, eq(booking.seekerUserId, seekerUser.id))
      .innerJoin(service, eq(booking.serviceId, service.id))
      .innerJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .where(whereCondition)
      .orderBy(desc(booking.createdAt));

    // For seeker view, also get service rating info
    if (role === 'seeker') {
      const resultsWithRating = await Promise.all(
        results.map(async b => {
          const [serviceRating] = await this.dbService.db
            .select({
              avgRating: sql`COALESCE(AVG(${review.rating}), 0)`.mapWith(Number),
              reviewCount: sql`COUNT(DISTINCT ${review.id})`.mapWith(Number),
            })
            .from(review)
            .where(eq(review.serviceId, b.serviceId));

          return {
            ...b,
            serviceRating: {
              avgRating: serviceRating?.avgRating ?? 0,
              reviewCount: serviceRating?.reviewCount ?? 0,
            },
          };
        }),
      );
      return resultsWithRating;
    }

    return results;
  }

  async getBookingRequestDetails(bookingId: string, userId: string) {
    // Verify user is part of this booking
    const [bookingRecord] = await this.dbService.db
      .select({
        id: booking.id,
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
        status: booking.status,
      })
      .from(booking)
      .where(eq(booking.id, bookingId))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    if (bookingRecord.providerUserId !== userId && bookingRecord.seekerUserId !== userId) {
      throw new BadRequestException('You are not authorized to access this booking');
    }

    // Get the most recent request associated with this seeker (the one that led to this booking)
    const [requestRecord] = await this.dbService.db
      .select({
        id: request.id,
        serviceTypeId: request.serviceTypeId,
        description: request.description,
        createdAt: request.createdAt,
        serviceTypeName: serviceType.name,
        serviceTypeIcon: serviceType.iconUrl,
      })
      .from(request)
      .innerJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .where(eq(request.seekerUserId, bookingRecord.seekerUserId))
      .orderBy(desc(request.createdAt))
      .limit(1);

    if (!requestRecord) {
      throw new NotFoundException('Request details not found');
    }

    // Get address
    const [addressRecord] = await this.dbService.db
      .select({
        label: address.label,
        coordinates: address.coordinates,
      })
      .from(request)
      .innerJoin(address, eq(request.addressId, address.id))
      .where(eq(request.id, requestRecord.id))
      .limit(1);

    // Get request images
    const images = await this.dbService.db
      .select({
        image: requestImage.image,
      })
      .from(requestImage)
      .where(eq(requestImage.requestId, requestRecord.id));

    // Get seeker info
    const [seekerInfo] = await this.dbService.db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
      })
      .from(user)
      .where(eq(user.id, bookingRecord.seekerUserId))
      .limit(1);

    return {
      id: requestRecord.id,
      serviceTypeId: requestRecord.serviceTypeId,
      serviceTypeName: requestRecord.serviceTypeName,
      serviceTypeIcon: requestRecord.serviceTypeIcon,
      description: requestRecord.description,
      createdAt: requestRecord.createdAt,
      address: addressRecord || null,
      images: images.map(img => img.image),
      seeker: seekerInfo || null,
    };
  }

  async getBookingChatLogs(bookingId: string, userId: string) {
    // Verify user is part of this booking
    const [bookingRecord] = await this.dbService.db
      .select({
        id: booking.id,
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
      })
      .from(booking)
      .where(eq(booking.id, bookingId))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    if (bookingRecord.providerUserId !== userId && bookingRecord.seekerUserId !== userId) {
      throw new BadRequestException('You are not authorized to access this booking');
    }

    // Get all messages for this booking
    const messages = await this.dbService.db
      .select({
        id: message.id,
        userId: message.userId,
        message: message.message,
        createdAt: message.createdAt,
        senderFirstName: user.firstName,
        senderLastName: user.lastName,
        senderAvatarUrl: user.avatarUrl,
      })
      .from(message)
      .innerJoin(user, eq(message.userId, user.id))
      .where(eq(message.bookingId, bookingId))
      .orderBy(message.createdAt);

    return {
      messages: messages.map(msg => ({
        id: msg.id,
        userId: msg.userId,
        message: msg.message,
        createdAt: msg.createdAt,
        sender: {
          id: msg.userId,
          firstName: msg.senderFirstName,
          lastName: msg.senderLastName,
          avatarUrl: msg.senderAvatarUrl,
        },
      })),
      total: messages.length,
    };
  }
}
