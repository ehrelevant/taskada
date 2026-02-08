import { API_URL } from '@lib/env';
import { io, Socket } from 'socket.io-client';

import { authClient } from './authClient';

export class ChatSocketClient {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((data: TypingData) => void)[] = [];
  private userJoinedHandlers: ((data: { userId: string; bookingId: string }) => void)[] = [];
  private userLeftHandlers: ((data: { userId: string; bookingId: string }) => void)[] = [];
  private bookingDeclinedHandlers: ((data: { bookingId: string; requestId: string }) => void)[] = [];
  private proposalSubmittedHandlers: ((data: ProposalSubmittedData) => void)[] = [];
  private proposalAcceptedHandlers: ((data: ProposalAcceptedData) => void)[] = [];
  private providerArrivedHandlers: ((data: { bookingId: string }) => void)[] = [];

  async connect(userId: string, userRole: 'seeker' | 'provider'): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    // Get the auth cookie
    const cookie = await authClient.getCookie();

    this.socket = io(`${API_URL}/chat`, {
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: cookie ? { Cookie: cookie } : undefined,
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

    this.socket.on('proposal_submitted', (data: ProposalSubmittedData) => {
      this.proposalSubmittedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('proposal_accepted', (data: ProposalAcceptedData) => {
      this.proposalAcceptedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('provider_arrived', (data: { bookingId: string }) => {
      this.providerArrivedHandlers.forEach(handler => handler(data));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Chat socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinBooking(bookingId: string) {
    this.socket?.emit('join_booking_chat', { bookingId });
  }

  leaveBooking(bookingId: string) {
    this.socket?.emit('leave_booking_chat', { bookingId });
  }

  sendMessage(bookingId: string, message: string) {
    this.socket?.emit('send_message', { bookingId, message });
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

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  onTyping(handler: (data: TypingData) => void) {
    this.typingHandlers.push(handler);
  }

  onUserJoined(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userJoinedHandlers.push(handler);
  }

  onUserLeft(handler: (data: { userId: string; bookingId: string }) => void) {
    this.userLeftHandlers.push(handler);
  }

  onBookingDeclined(handler: (data: { bookingId: string; requestId: string }) => void) {
    this.bookingDeclinedHandlers.push(handler);
  }

  onProposalSubmitted(handler: (data: ProposalSubmittedData) => void) {
    this.proposalSubmittedHandlers.push(handler);
  }

  onProposalAccepted(handler: (data: ProposalAcceptedData) => void) {
    this.proposalAcceptedHandlers.push(handler);
  }

  onProviderArrived(handler: (data: { bookingId: string }) => void) {
    this.providerArrivedHandlers.push(handler);
  }

  removeAllListeners() {
    this.messageHandlers = [];
    this.typingHandlers = [];
    this.userJoinedHandlers = [];
    this.userLeftHandlers = [];
    this.bookingDeclinedHandlers = [];
    this.proposalSubmittedHandlers = [];
    this.proposalAcceptedHandlers = [];
    this.providerArrivedHandlers = [];
  }
}

export interface ProposalAcceptedData {
  bookingId: string;
  seekerLocation: {
    label: string | null;
    coordinates: [number, number];
  };
}

export interface Message {
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
}

export interface TypingData {
  userId: string;
  bookingId: string;
  isTyping: boolean;
}

export interface ProposalSubmittedData {
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
}

export const chatSocket = new ChatSocketClient();
