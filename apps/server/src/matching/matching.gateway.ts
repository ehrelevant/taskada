import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { MatchingService } from './matching.service';
import { WsAuthGuard } from './ws-auth.guard';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/matching',
})
export class MatchingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MatchingGateway.name);

  constructor(private readonly matchingService: MatchingService) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Provider joins rooms for their enabled service types
  // This should be called when provider enables accepting requests
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join_provider_rooms')
  async handleJoinProviderRooms(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { serviceTypeIds: string[] },
  ) {
    if (!client.userId || client.userRole !== 'provider') {
      client.emit('error', { message: 'Unauthorized: Only providers can join rooms' });
      return;
    }

    const { serviceTypeIds } = data;

    if (!Array.isArray(serviceTypeIds) || serviceTypeIds.length === 0) {
      client.emit('error', { message: 'Invalid service type IDs' });
      return;
    }

    // Join rooms for each service type
    for (const serviceTypeId of serviceTypeIds) {
      const roomName = `service-type:${serviceTypeId}`;
      await client.join(roomName);
      this.logger.log(`Provider ${client.userId} joined room ${roomName}`);
    }

    // Also join personal room for direct requests
    await client.join(`provider:${client.userId}`);

    client.emit('joined_rooms', {
      serviceTypeIds,
      message: 'Successfully joined provider rooms',
    });
  }

  // Provider leaves rooms for their service types
  // This should be called when provider disables accepting requests
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave_provider_rooms')
  async handleLeaveProviderRooms(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { serviceTypeIds: string[] },
  ) {
    if (!client.userId || client.userRole !== 'provider') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { serviceTypeIds } = data;

    // Leave rooms for each service type
    for (const serviceTypeId of serviceTypeIds) {
      const roomName = `service-type:${serviceTypeId}`;
      await client.leave(roomName);
      this.logger.log(`Provider ${client.userId} left room ${roomName}`);
    }

    // Leave personal room
    await client.leave(`provider:${client.userId}`);

    client.emit('left_rooms', {
      serviceTypeIds,
      message: 'Successfully left provider rooms',
    });
  }

  // Seeker starts watching their request
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('watch_request')
  async handleWatchRequest(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { requestId: string }) {
    if (!client.userId || client.userRole !== 'seeker') {
      client.emit('error', { message: 'Unauthorized: Only seekers can watch requests' });
      return;
    }

    const { requestId } = data;

    if (!requestId) {
      client.emit('error', { message: 'Request ID is required' });
      return;
    }

    // Join room for this specific request
    await client.join(`request:${requestId}`);
    this.logger.log(`Seeker ${client.userId} started watching request ${requestId}`);

    client.emit('watching_request', { requestId });
  }

  // Seeker stops watching their request
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unwatch_request')
  async handleUnwatchRequest(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { requestId: string },
  ) {
    if (!client.userId) {
      return;
    }

    const { requestId } = data;

    if (!requestId) {
      return;
    }

    await client.leave(`request:${requestId}`);
    this.logger.log(`Seeker ${client.userId} stopped watching request ${requestId}`);

    client.emit('unwatched_request', { requestId });
  }

  // Seeker cancels their request
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('cancel_request')
  async handleCancelRequest(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { requestId: string },
  ) {
    if (!client.userId || client.userRole !== 'seeker') {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const { requestId } = data;

    if (!requestId) {
      client.emit('error', { message: 'Request ID is required' });
      return;
    }

    // Get request details before deleting to know which rooms to notify
    const requestDetails = await this.matchingService.getRequestDetails(requestId);

    if (!requestDetails) {
      client.emit('error', { message: 'Request not found' });
      return;
    }

    // Delete the request
    const deleted = await this.matchingService.deleteRequest(requestId);

    if (!deleted) {
      client.emit('error', { message: 'Failed to cancel request' });
      return;
    }

    // Notify the seeker
    client.emit('request_cancelled', { requestId });

    // Notify providers in the relevant rooms
    const roomName = requestDetails.serviceId
      ? `provider:${requestDetails.serviceId}`
      : `service-type:${requestDetails.serviceTypeId}`;

    this.server.to(roomName).emit('request_removed', { requestId });
    this.logger.log(`Request ${requestId} cancelled by seeker ${client.userId}`);
  }

  // Broadcast a new request to relevant providers
  // This is called by the requests service when a new request is created
  async broadcastNewRequest(requestId: string, serviceTypeId: string, serviceId?: string) {
    const requestDetails = await this.matchingService.getRequestDetails(requestId);

    if (!requestDetails) {
      this.logger.error(`Failed to broadcast request ${requestId}: not found`);
      return;
    }

    // Determine which room(s) to broadcast to
    if (serviceId) {
      // Specific provider request
      const roomName = `provider:${serviceId}`;
      this.server.to(roomName).emit('new_request', requestDetails);
      this.logger.log(`Broadcasted request ${requestId} to room ${roomName}`);
    } else {
      // General service type request
      const roomName = `service-type:${serviceTypeId}`;
      this.server.to(roomName).emit('new_request', requestDetails);
      this.logger.log(`Broadcasted request ${requestId} to room ${roomName}`);
    }
  }

  // Notify seeker that a provider is viewing their request
  async notifyProviderViewing(requestId: string, providerId: string, providerName: string) {
    this.server.to(`request:${requestId}`).emit('provider_viewing', {
      requestId,
      providerId,
      providerName,
    });
  }
}
