import { io, Socket } from 'socket.io-client';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class MatchingSocketClient {
  private socket: AuthenticatedSocket | null = null;
  private static instance: MatchingSocketClient;
  private joinedProviderRoomServiceTypeIds = new Set<string>();
  private watchedRequestIds = new Set<string>();

  static getInstance(): MatchingSocketClient {
    if (!MatchingSocketClient.instance) {
      MatchingSocketClient.instance = new MatchingSocketClient();
    }
    return MatchingSocketClient.instance;
  }

  async connect(
    baseUrl: string,
    cookie: string,
    userId: string,
    userRole: 'seeker' | 'provider',
  ): Promise<AuthenticatedSocket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(`${baseUrl}/matching`, {
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: cookie ? { Cookie: cookie } : undefined,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      auth: {
        userId,
        userRole,
      },
    }) as AuthenticatedSocket;

    this.socket.userId = userId;
    this.socket.userRole = userRole;

    return new Promise((resolve, reject) => {
      this.socket!.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        resolve(this.socket!);
      });

      this.socket!.on('reconnect', () => {
        void this.rejoinTrackedRooms();
      });

      this.socket!.on('connect_error', error => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      this.socket!.on('error', error => {
        console.error('Socket error:', error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.joinedProviderRoomServiceTypeIds.clear();
      this.watchedRequestIds.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  async watchRequest(requestId: string) {
    if (!this.isConnected()) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('watch_request', { requestId });
    this.watchedRequestIds.add(requestId);
  }

  async unwatchRequest(requestId: string) {
    if (!this.isConnected()) {
      return;
    }
    this.socket!.emit('unwatch_request', { requestId });
    this.watchedRequestIds.delete(requestId);
  }

  async cancelRequest(requestId: string) {
    if (!this.isConnected()) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('cancel_request', { requestId });
  }

  async joinProviderRooms(serviceTypeIds: string[]) {
    if (!this.isConnected()) {
      throw new Error('Socket not connected');
    }
    this.socket!.emit('join_provider_rooms', { serviceTypeIds });
    serviceTypeIds.forEach(serviceTypeId => this.joinedProviderRoomServiceTypeIds.add(serviceTypeId));
  }

  async leaveProviderRooms(serviceTypeIds: string[]) {
    if (!this.isConnected()) {
      return;
    }
    this.socket!.emit('leave_provider_rooms', { serviceTypeIds });
    serviceTypeIds.forEach(serviceTypeId => this.joinedProviderRoomServiceTypeIds.delete(serviceTypeId));
  }

  private async rejoinTrackedRooms(): Promise<void> {
    if (!this.socket?.connected) {
      return;
    }

    const providerRoomIds = [...this.joinedProviderRoomServiceTypeIds];
    if (providerRoomIds.length > 0) {
      this.socket.emit('join_provider_rooms', { serviceTypeIds: providerRoomIds });
    }

    for (const requestId of this.watchedRequestIds) {
      this.socket.emit('watch_request', { requestId });
    }
  }

  onNewRequest(callback: (request: unknown) => void) {
    this.socket?.on('new_request', callback);
  }

  offNewRequest(callback: (request: unknown) => void) {
    this.socket?.off('new_request', callback);
  }

  onRequestRemoved(callback: (data: { requestId: string }) => void) {
    this.socket?.on('request_removed', callback);
  }

  offRequestRemoved(callback: (data: { requestId: string }) => void) {
    this.socket?.off('request_removed', callback);
  }

  onRequestCancelled(callback: (data: { requestId: string }) => void) {
    this.socket?.on('request_cancelled', callback);
  }

  offRequestCancelled(callback: (data: { requestId: string }) => void) {
    this.socket?.off('request_cancelled', callback);
  }

  onProviderViewing(callback: (data: { requestId: string; providerId: string; providerName: string }) => void) {
    this.socket?.on('provider_viewing', callback);
  }

  offProviderViewing(callback: (data: { requestId: string; providerId: string; providerName: string }) => void) {
    this.socket?.off('provider_viewing', callback);
  }

  onRequestSettling(
    callback: (data: {
      requestId: string;
      bookingId: string;
      provider: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
    }) => void,
  ) {
    this.socket?.on('request_settling', callback);
  }

  offRequestSettling(
    callback: (data: {
      requestId: string;
      bookingId: string;
      provider: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
    }) => void,
  ) {
    this.socket?.off('request_settling', callback);
  }

  onError(callback: (error: { message: string }) => void) {
    this.socket?.on('error', callback);
  }

  offError(callback: (error: { message: string }) => void) {
    this.socket?.off('error', callback);
  }
}

export const matchingSocket = MatchingSocketClient.getInstance();
