export type BookingStatus = 'in_transit' | 'serving' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  providerUserId: string;
  serviceId: string;
  seekerUserId: string;
  status: BookingStatus;
  cost: number;
  specifications: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  cost: number;
  specifications: string;
  serviceTypeName: string;
  address: {
    label: string | null;
    coordinates: [number, number];
  };
}

export interface CreateProposalPayload {
  requestId: string;
  serviceId: string;
  cost: number;
  specifications: string;
}
