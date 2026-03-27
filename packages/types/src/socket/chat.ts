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
  imageUrls: string[];
}

export interface TypingData {
  userId: string;
  bookingId: string;
  isTyping: boolean;
}

export interface UserJoinedData {
  userId: string;
  bookingId: string;
}

export interface UserLeftData {
  userId: string;
  bookingId: string;
}

export interface BookingDeclinedData {
  bookingId: string;
  requestId: string;
}

export interface ProposalDeclinedData {
  bookingId: string;
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

export interface ProposalAcceptedData {
  bookingId: string;
  seekerLocation: {
    label: string | null;
    coordinates: [number, number];
  };
}

export interface ProviderArrivedData {
  bookingId: string;
}

export interface BookingCompletedData {
  bookingId: string;
}
