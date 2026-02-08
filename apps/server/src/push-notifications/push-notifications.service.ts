import { eq } from 'drizzle-orm';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { pushToken } from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class PushNotificationsService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(private readonly dbService: DatabaseService) {
    this.expo = new Expo();
  }

  async registerPushToken(userId: string, token: string, platform: string): Promise<void> {
    // Check if token already exists for this user
    const [existingToken] = await this.dbService.db.select().from(pushToken).where(eq(pushToken.token, token)).limit(1);

    if (existingToken) {
      // Update the userId if token exists but belongs to different user
      if (existingToken.userId !== userId) {
        await this.dbService.db.update(pushToken).set({ userId }).where(eq(pushToken.id, existingToken.id));
      }
      return;
    }

    // Insert new token
    await this.dbService.db.insert(pushToken).values({
      userId,
      token,
      platform,
    });

    this.logger.log(`Registered push token for user ${userId}`);
  }

  async unregisterPushToken(userId: string, token: string): Promise<void> {
    await this.dbService.db.delete(pushToken).where(eq(pushToken.token, token));

    this.logger.log(`Unregistered push token for user ${userId}`);
  }

  async getUserPushTokens(userId: string): Promise<string[]> {
    const tokens = await this.dbService.db
      .select({ token: pushToken.token })
      .from(pushToken)
      .where(eq(pushToken.userId, userId));

    return tokens.map(t => t.token);
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<void> {
    const tokens = await this.getUserPushTokens(userId);

    if (tokens.length === 0) {
      this.logger.warn(`No push tokens found for user ${userId}`);
      return;
    }

    const messages: ExpoPushMessage[] = [];

    for (const token of tokens) {
      if (!Expo.isExpoPushToken(token)) {
        this.logger.error(`Invalid Expo push token: ${token}`);
        continue;
      }

      messages.push({
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
      });
    }

    // Send notifications in chunks
    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log(`Sent ${ticketChunk.length} push notifications`);

        // Check for errors
        for (const ticket of ticketChunk) {
          if (ticket.status === 'error') {
            this.logger.error(`Push notification error: ${ticket.message}`);
          }
        }
      } catch (error) {
        this.logger.error('Error sending push notifications:', error);
      }
    }
  }

  async sendChatMessageNotification(
    recipientUserId: string,
    senderName: string,
    messagePreview: string,
    bookingId: string,
  ): Promise<void> {
    // Truncate message preview if too long
    const truncatedMessage = messagePreview.length > 100 ? messagePreview.substring(0, 97) + '...' : messagePreview;

    await this.sendPushNotification(recipientUserId, `New message from ${senderName}`, truncatedMessage, {
      type: 'chat_message',
      bookingId,
    });
  }
}
