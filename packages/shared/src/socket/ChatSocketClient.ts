import { io, Socket } from 'socket.io-client';

// Types will be imported inline where needed to avoid cross-package type issues
export type Message = {
  id: string;
  userId: string;
  message: string | null;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  imageUrls: string[];
};

export type TypingData = {
  userId: string;
  bookingId: string;
  isTyping: boolean;
};

export type ProposalAcceptedData = {
  bookingId: string;
  seekerLocation: {
    label: string | null;
    coordinates: [number, number];
  };
};

export type ProposalSubmittedData = {
  bookingId: string;
  providerInfo: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  proposal: {
    cost: number;
    specifications: string;
    serviceTypeName: string;
    address:
      | {
          label: string | null;
          coordinates: [number, number];
        }
      | undefined;
  };
};

export class ChatSocketClient {
  private socket: Socket | null = null;
  private joinedBookingIds = new Set<string>();
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((data: TypingData) => void)[] = [];
  private userJoinedHandlers: ((data: { userId: string; bookingId: string }) => void)[] = [];
  private userLeftHandlers: ((data: { userId: string; bookingId: string }) => void)[] = [];
  private bookingDeclinedHandlers: ((data: { bookingId: string; requestId: string }) => void)[] = [];
  private proposalDeclinedHandlers: ((data: { bookingId: string }) => void)[] = [];
  private proposalSubmittedHandlers: ((data: ProposalSubmittedData) => void)[] = [];
  private proposalAcceptedHandlers: ((data: ProposalAcceptedData) => void)[] = [];
  private providerArrivedHandlers: ((data: { bookingId: string }) => void)[] = [];
  private bookingCompletedHandlers: ((data: { bookingId: string }) => void)[] = [];
  private bookingCancelledHandlers: ((data: { bookingId: string }) => void)[] = [];

  async connect(baseUrl: string, cookie: string, userId: string, userRole: 'seeker' | 'provider'): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(`${baseUrl}/chat`, {
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
    });

    this.socket.on('connect', () => {
      console.log('Chat socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Chat socket disconnected');
    });

    this.socket.on('reconnect', () => {
      this.rejoinBookings();
    });

    this.socket.on('new_message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('user_typing', (data: TypingData) => {
      this.typingHandlers.forEach(handler => handler(data));
    });

    this.socket.on('user_joined', (data: { userId: string; bookingId: string }) => {
      this.userJoinedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('user_left', (data: { userId: string; bookingId: string }) => {
      this.userLeftHandlers.forEach(handler => handler(data));
    });

    this.socket.on('booking_declined', (data: { bookingId: string; requestId: string }) => {
      this.bookingDeclinedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('proposal_declined', (data: { bookingId: string }) => {
      this.proposalDeclinedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('proposal_submitted', (data: ProposalSubmittedData) => {
      this.proposalSubmittedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('proposal_accepted', (data: ProposalAcceptedData) => {
      this.proposalAcceptedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('provider_arrived', (data: { bookingId: string }) => {
      this.providerArrivedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('booking_completed', (data: { bookingId: string }) => {
      this.bookingCompletedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('booking_cancelled', (data: { bookingId: string }) => {
      this.bookingCancelledHandlers.forEach(handler => handler(data));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Chat socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.joinedBookingIds.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  joinBooking(bookingId: string) {
    this.joinedBookingIds.add(bookingId);
    this.socket?.emit('join_booking_chat', { bookingId });
  }

  leaveBooking(bookingId: string) {
    this.joinedBookingIds.delete(bookingId);
    this.socket?.emit('leave_booking_chat', { bookingId });
  }

  sendMessage(bookingId: string, message: string, imageKeys?: string[]) {
    this.socket?.emit('send_message', { bookingId, message, imageKeys: imageKeys || [] });
  }

  sendTyping(bookingId: string, isTyping: boolean) {
    this.socket?.emit('typing', { bookingId, isTyping });
  }

  declineBooking(bookingId: string, requestId: string) {
    this.socket?.emit('decline_booking', { bookingId, requestId });
  }

  declineProposal(bookingId: string) {
    this.socket?.emit('decline_proposal', { bookingId });
  }

  acceptProposal(bookingId: string) {
    this.socket?.emit('accept_proposal', { bookingId });
  }

  notifyArrival(bookingId: string) {
    this.socket?.emit('provider_arrived', { bookingId });
  }

  notifyBookingCompleted(bookingId: string) {
    this.socket?.emit('booking_completed', { bookingId });
  }

  cancelBooking(bookingId: string) {
    this.socket?.emit('cancel_booking', { bookingId });
  }

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  offNewMessage(handler: (message: Message) => void) {
    this.messageHandlers = this.messageHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onTyping(handler: (data: TypingData) => void) {
    this.typingHandlers.push(handler);
  }

  offTyping(handler: (data: TypingData) => void) {
    this.typingHandlers = this.typingHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onUserJoined(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userJoinedHandlers.push(handler);
  }

  offUserJoined(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userJoinedHandlers = this.userJoinedHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onUserLeft(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userLeftHandlers.push(handler);
  }

  offUserLeft(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userLeftHandlers = this.userLeftHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onBookingDeclined(handler: (data: { bookingId: string; requestId: string }) => void) {
    this.bookingDeclinedHandlers.push(handler);
  }

  offBookingDeclined(handler: (data: { bookingId: string; requestId: string }) => void) {
    this.bookingDeclinedHandlers = this.bookingDeclinedHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onProposalDeclined(handler: (data: { bookingId: string }) => void) {
    this.proposalDeclinedHandlers.push(handler);
  }

  offProposalDeclined(handler: (data: { bookingId: string }) => void) {
    this.proposalDeclinedHandlers = this.proposalDeclinedHandlers.filter(
      existingHandler => existingHandler !== handler,
    );
  }

  onProposalSubmitted(handler: (data: ProposalSubmittedData) => void) {
    this.proposalSubmittedHandlers.push(handler);
  }

  offProposalSubmitted(handler: (data: ProposalSubmittedData) => void) {
    this.proposalSubmittedHandlers = this.proposalSubmittedHandlers.filter(
      existingHandler => existingHandler !== handler,
    );
  }

  onProposalAccepted(handler: (data: ProposalAcceptedData) => void) {
    this.proposalAcceptedHandlers.push(handler);
  }

  offProposalAccepted(handler: (data: ProposalAcceptedData) => void) {
    this.proposalAcceptedHandlers = this.proposalAcceptedHandlers.filter(
      existingHandler => existingHandler !== handler,
    );
  }

  onProviderArrived(handler: (data: { bookingId: string }) => void) {
    this.providerArrivedHandlers.push(handler);
  }

  offProviderArrived(handler: (data: { bookingId: string }) => void) {
    this.providerArrivedHandlers = this.providerArrivedHandlers.filter(existingHandler => existingHandler !== handler);
  }

  onBookingCompleted(handler: (data: { bookingId: string }) => void) {
    this.bookingCompletedHandlers.push(handler);
  }

  offBookingCompleted(handler: (data: { bookingId: string }) => void) {
    this.bookingCompletedHandlers = this.bookingCompletedHandlers.filter(
      existingHandler => existingHandler !== handler,
    );
  }

  onBookingCancelled(handler: (data: { bookingId: string }) => void) {
    this.bookingCancelledHandlers.push(handler);
  }

  offBookingCancelled(handler: (data: { bookingId: string }) => void) {
    this.bookingCancelledHandlers = this.bookingCancelledHandlers.filter(
      existingHandler => existingHandler !== handler,
    );
  }

  removeAllListeners() {
    this.messageHandlers = [];
    this.typingHandlers = [];
    this.userJoinedHandlers = [];
    this.userLeftHandlers = [];
    this.bookingDeclinedHandlers = [];
    this.proposalDeclinedHandlers = [];
    this.proposalSubmittedHandlers = [];
    this.proposalAcceptedHandlers = [];
    this.providerArrivedHandlers = [];
    this.bookingCompletedHandlers = [];
    this.bookingCancelledHandlers = [];
  }

  private rejoinBookings() {
    if (!this.socket?.connected) {
      return;
    }

    for (const bookingId of this.joinedBookingIds) {
      this.socket.emit('join_booking_chat', { bookingId });
    }
  }
}

export const chatSocket = new ChatSocketClient();
