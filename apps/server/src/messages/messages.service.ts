import { address, booking, message, messageImage, request, user } from '@repo/database';
import { desc, eq, sql } from 'drizzle-orm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { S3Service } from '../s3/s3.service';

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
  imageUrls: string[];
}

export interface CreateMessageData {
  bookingId: string;
  userId: string;
  message: string;
  imageKeys?: string[];
}

@Injectable()
export class MessagesService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async getMessagesForBooking(bookingId: string, userId: string, limit = 50, offset = 0) {
    await this.verifyUserInBooking(bookingId, userId);

    const [{ total }] = await this.dbService.db
      .select({ total: sql`COUNT(*)`.mapWith(Number) })
      .from(message)
      .where(eq(message.bookingId, bookingId));

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

    const messageIds = messages.map(m => m.id);
    const images = await this.dbService.db
      .select({
        messageId: messageImage.messageId,
        image: messageImage.image,
      })
      .from(messageImage)
      .where(sql`${messageImage.messageId} IN ${messageIds}`);

    const imagesByMessageId = images.reduce(
      (acc, img) => {
        if (!acc[img.messageId]) {
          acc[img.messageId] = [];
        }
        acc[img.messageId].push(img.image);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const formattedMessages: MessageWithSender[] = await Promise.all(
      messages.map(async msg => {
        const imageKeys = imagesByMessageId[msg.id] || [];
        const imageUrls = await Promise.all(imageKeys.map(key => this.s3Service.getSignedUrl(key)));

        return {
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
          imageUrls,
        };
      }),
    );

    return {
      messages: formattedMessages.reverse(),
      total,
      hasMore,
    };
  }

  async createMessage(data: CreateMessageData): Promise<MessageWithSender> {
    await this.verifyUserInBooking(data.bookingId, data.userId);

    const [newMessage] = await this.dbService.db
      .insert(message)
      .values({
        bookingId: data.bookingId,
        userId: data.userId,
        message: data.message,
      })
      .returning();

    const imageKeys = data.imageKeys || [];

    if (imageKeys.length > 0) {
      await this.dbService.db.insert(messageImage).values(
        imageKeys.map(key => ({
          messageId: newMessage.id,
          image: key,
        })),
      );
    }

    const [sender] = await this.dbService.db
      .select({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, data.userId))
      .limit(1);

    const imageUrls = await Promise.all(imageKeys.map(key => this.s3Service.getSignedUrl(key)));

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
      imageUrls,
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

  async getBookingParticipants(bookingId: string) {
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

  async getSeekerAddress(bookingId: string) {
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
}
