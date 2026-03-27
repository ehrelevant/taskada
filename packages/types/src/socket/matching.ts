export interface NewRequestEvent {
  requestId: string;
  serviceTypeId: string;
  serviceTypeName: string;
  description: string;
  address: {
    label: string | null;
    coordinates: [number, number];
  };
  imageUrls: string[];
  createdAt: string;
  seekerInfo: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface RequestRemovedEvent {
  requestId: string;
}

export interface RequestCancelledEvent {
  requestId: string;
}

export interface ProviderViewingEvent {
  requestId: string;
  providerId: string;
  providerName: string;
}

export interface RequestSettlingEvent {
  requestId: string;
  bookingId: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface MatchingErrorEvent {
  message: string;
}
