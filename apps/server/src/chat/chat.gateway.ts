import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { MessagesService } from '../messages/messages.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { WsAuthGuard } from '../matching/ws-auth.guard';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface TypingData {
  bookingId: string;
  isTyping: boolean;
}

interface SendMessageData {
  bookingId: string;
  message: string;
}

interface JoinBookingData {
  bookingId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join_booking_chat')
  async handleJoinBookingChat(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: JoinBookingData) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId } = data;

    try {
      // Verify user is part of this booking
      await this.messagesService.verifyUserInBooking(bookingId, client.userId);

      // Join the booking room
      const roomName = `booking:${bookingId}`;
      await client.join(roomName);

      this.logger.log(`User ${client.userId} joined chat room ${roomName}`);

      // Notify other users in the room
      client.to(roomName).emit('user_joined', {
        userId: client.userId,
        bookingId,
      });

      client.emit('joined_booking_chat', {
        bookingId,
        message: 'Successfully joined booking chat',
      });
    } catch (error) {
      this.logger.error(`Error joining booking chat: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to join chat' });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave_booking_chat')
  async handleLeaveBookingChat(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: JoinBookingData) {
    if (!client.userId) {
      return;
    }

    const { bookingId } = data;
    const roomName = `booking:${bookingId}`;

    await client.leave(roomName);

    this.logger.log(`User ${client.userId} left chat room ${roomName}`);

    // Notify other users
    client.to(roomName).emit('user_left', {
      userId: client.userId,
      bookingId,
    });

    client.emit('left_booking_chat', {
      bookingId,
      message: 'Successfully left booking chat',
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: SendMessageData) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId, message } = data;

    try {
      // Save message to database
      const newMessage = await this.messagesService.createMessage({
        bookingId,
        userId: client.userId,
        message,
      });

      // Broadcast to all users in the booking room
      const roomName = `booking:${bookingId}`;
      this.server.to(roomName).emit('new_message', newMessage);

      // Get booking participants to send push notification to the other user
      const participants = await this.messagesService.getBookingParticipants(bookingId);
      const otherUserId =
        participants.providerUserId === client.userId ? participants.seekerUserId : participants.providerUserId;

      // Send push notification to the other user
      const senderName = `${newMessage.sender.firstName} ${newMessage.sender.lastName}`;
      await this.pushNotificationsService.sendChatMessageNotification(otherUserId, senderName, message, bookingId);

      this.logger.log(`Message sent in booking ${bookingId} by user ${client.userId}`);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to send message' });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('typing')
  async handleTyping(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: TypingData) {
    if (!client.userId) {
      return;
    }

    const { bookingId, isTyping } = data;
    const roomName = `booking:${bookingId}`;

    // Broadcast typing status to other users in the room (excluding sender)
    client.to(roomName).emit('user_typing', {
      userId: client.userId,
      bookingId,
      isTyping,
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('decline_booking')
  async handleDeclineBooking(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string; requestId: string },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId, requestId } = data;

    try {
      // Get booking participants to identify the seeker
      const participants = await this.messagesService.getBookingParticipants(bookingId);

      // Broadcast to all users in the booking room
      await this.broadcastBookingDeclined(bookingId, requestId, participants.seekerUserId);

      this.logger.log(`Booking ${bookingId} declined by provider ${client.userId}`);
    } catch (error) {
      this.logger.error(`Error declining booking: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to decline booking' });
    }
  }

  // Method to broadcast booking_declined event to seeker
  async broadcastBookingDeclined(bookingId: string, requestId: string, seekerUserId: string): Promise<void> {
    const roomName = `booking:${bookingId}`;
    this.server.to(roomName).emit('booking_declined', {
      bookingId,
      requestId,
    });

    // Also send push notification to seeker
    await this.pushNotificationsService.sendPushNotification(
      seekerUserId,
      'Booking Declined',
      'The provider has declined your request. You can wait for other providers.',
      {
        type: 'booking_declined',
        bookingId,
        requestId,
      },
    );

    this.logger.log(`Broadcasted booking_declined for booking ${bookingId}`);
  }

  // Method to broadcast new booking to seeker
  async broadcastNewBooking(
    bookingId: string,
    seekerUserId: string,
    providerInfo: { firstName: string; lastName: string },
  ): Promise<void> {
    // Send push notification to seeker
    await this.pushNotificationsService.sendPushNotification(
      seekerUserId,
      'New Booking Request',
      `${providerInfo.firstName} ${providerInfo.lastName} wants to discuss your service request.`,
      {
        type: 'new_booking',
        bookingId,
      },
    );

    this.logger.log(`Sent new booking notification to seeker ${seekerUserId}`);
  }

  // Method to broadcast proposal submitted to seeker
  async broadcastProposalSubmitted(
    bookingId: string,
    seekerUserId: string,
    providerInfo: { id: string; firstName: string; lastName: string; avatarUrl: string | null },
    proposal: {
      cost: number;
      specifications: string;
      serviceTypeName: string;
      address: { label: string | null; coordinates: unknown } | undefined;
    },
  ): Promise<void> {
    const roomName = `booking:${bookingId}`;

    // Broadcast to all users in the booking room
    this.server.to(roomName).emit('proposal_submitted', {
      bookingId,
      providerInfo,
      proposal,
    });

    // Send push notification to seeker
    await this.pushNotificationsService.sendPushNotification(
      seekerUserId,
      'New Service Proposal',
      `${providerInfo.firstName} ${providerInfo.lastName} has submitted service cost and specifications.`,
      {
        type: 'proposal_submitted',
        bookingId,
        cost: proposal.cost,
        specifications: proposal.specifications,
        serviceTypeName: proposal.serviceTypeName,
      },
    );

    this.logger.log(`Broadcasted proposal_submitted for booking ${bookingId}`);
  }

  // Method to broadcast proposal declined to provider
  async broadcastProposalDeclined(bookingId: string, providerUserId: string): Promise<void> {
    const roomName = `booking:${bookingId}`;

    // Broadcast to all users in the booking room
    this.server.to(roomName).emit('proposal_declined', {
      bookingId,
    });

    // Send push notification to provider
    await this.pushNotificationsService.sendPushNotification(
      providerUserId,
      'Proposal Declined',
      'The seeker has declined your service proposal. You can discuss further in chat.',
      {
        type: 'proposal_declined',
        bookingId,
      },
    );

    this.logger.log(`Broadcasted proposal_declined for booking ${bookingId}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('decline_proposal')
  async handleDeclineProposal(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId } = data;

    try {
      // Get booking participants to identify the provider
      const participants = await this.messagesService.getBookingParticipants(bookingId);

      // Broadcast to all users in the booking room
      await this.broadcastProposalDeclined(bookingId, participants.providerUserId);

      this.logger.log(`Proposal ${bookingId} declined by seeker ${client.userId}`);
    } catch (error) {
      this.logger.error(`Error declining proposal: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to decline proposal' });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('accept_proposal')
  async handleAcceptProposal(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId } = data;

    try {
      // Get booking participants to identify the provider
      const participants = await this.messagesService.getBookingParticipants(bookingId);

      // Get seeker's address for the provider
      const seekerLocation = await this.messagesService.getSeekerAddress(bookingId);

      // Broadcast to all users in the booking room
      await this.broadcastProposalAccepted(bookingId, participants.providerUserId, seekerLocation);

      this.logger.log(`Proposal ${bookingId} accepted by seeker ${client.userId}`);
    } catch (error) {
      this.logger.error(`Error accepting proposal: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to accept proposal' });
    }
  }

  // Method to broadcast proposal_accepted event to provider
  async broadcastProposalAccepted(
    bookingId: string,
    providerUserId: string,
    seekerLocation: { label: string | null; coordinates: unknown } | undefined,
  ) {
    const roomName = `booking:${bookingId}`;

    // Broadcast to all users in the booking room
    this.server.to(roomName).emit('proposal_accepted', {
      bookingId,
      seekerLocation,
    });

    // Send push notification to provider
    await this.pushNotificationsService.sendPushNotification(
      providerUserId,
      'Proposal Accepted',
      'The seeker has accepted your service proposal. Head to their location now!',
      {
        type: 'proposal_accepted',
        bookingId,
      },
    );

    this.logger.log(`Broadcasted proposal_accepted for booking ${bookingId}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('provider_arrived')
  async handleProviderArrived(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }

    const { bookingId } = data;

    try {
      // Get booking participants to identify the seeker
      const participants = await this.messagesService.getBookingParticipants(bookingId);

      // Broadcast to all users in the booking room
      await this.broadcastProviderArrived(bookingId, participants.seekerUserId);

      this.logger.log(`Provider arrived for booking ${bookingId}`);
    } catch (error) {
      this.logger.error(`Error handling provider arrival: ${error.message}`);
      client.emit('error', { message: error.message || 'Failed to process arrival' });
    }
  }

  // Method to broadcast provider_arrived event to seeker
  async broadcastProviderArrived(bookingId: string, seekerUserId: string) {
    const roomName = `booking:${bookingId}`;

    // Broadcast to all users in the booking room
    this.server.to(roomName).emit('provider_arrived', {
      bookingId,
    });

    // Send push notification to seeker
    await this.pushNotificationsService.sendPushNotification(
      seekerUserId,
      'Provider Has Arrived',
      'Your service provider has arrived at your location and is ready to serve you.',
      {
        type: 'provider_arrived',
        bookingId,
      },
    );

    this.logger.log(`Broadcasted provider_arrived for booking ${bookingId}`);
  }
}
