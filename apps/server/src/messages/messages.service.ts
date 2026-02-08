import { booking, message, user } from '@repo/database';
import { desc, eq, sql } from 'drizzle-orm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

export interface MessageWithSender {
  id: string;
  userId: string;
  message: string | null;
  createdAt: Date;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface CreateMessageData {
  bookingId: string;
  userId: string;
  message: string;
}

@Injectable()
export class MessagesService {
  constructor(private readonly dbService: DatabaseService) {}

  async getMessagesForBooking(
    bookingId: string,
    userId: string,
    limit = 50,
    offset = 0,
  ) {
    // Verify user is part of this booking
    await this.verifyUserInBooking(bookingId, userId);

    // Get total count
    const [{ total }] = await this.dbService.db
      .select({ total: sql`COUNT(*)`.mapWith(Number) })
      .from(message)
      .where(eq(message.bookingId, bookingId));

    // Get messages with sender info
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
      .orderBy(desc(message.createdAt))
      .limit(limit)
      .offset(offset);

    const hasMore = offset + messages.length < total;

    const formattedMessages: MessageWithSender[] = messages.map(msg => ({
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
    }));

    return {
      messages: formattedMessages.reverse(), // Return in chronological order
      total,
      hasMore,
    };
  }

  async createMessage(data: CreateMessageData): Promise<MessageWithSender> {
    // Verify user is part of this booking
    await this.verifyUserInBooking(data.bookingId, data.userId);

    // Insert message
    const [newMessage] = await this.dbService.db
      .insert(message)
      .values({
        bookingId: data.bookingId,
        userId: data.userId,
        message: data.message,
      })
      .returning();

    // Get sender info
    const [sender] = await this.dbService.db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, data.userId))
      .limit(1);

    return {
      id: newMessage.id,
      userId: newMessage.userId,
      message: newMessage.message,
      createdAt: newMessage.createdAt,
      sender: {
        id: data.userId,
        firstName: sender.firstName,
        lastName: sender.lastName,
        avatarUrl: sender.avatarUrl,
      },
    };
  }

  async verifyUserInBooking(bookingId: string, userId: string) {
    const [bookingRecord] = await this.dbService.db.select().from(booking).where(eq(booking.id, bookingId)).limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user is either the provider or seeker in this booking
    if (bookingRecord.providerUserId !== userId && bookingRecord.seekerUserId !== userId) {
      throw new ForbiddenException('You are not authorized to access this booking');
    }
  }

  async getBookingParticipants(bookingId: string): Promise<{ providerUserId: string; seekerUserId: string }> {
    const [bookingRecord] = await this.dbService.db
      .select({
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
      })
      .from(booking)
      .where(eq(booking.id, bookingId))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    return bookingRecord;
  }

  async getUserInfo(userId: string) {
    const [userRecord] = await this.dbService.db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return userRecord || null;
  }
}
