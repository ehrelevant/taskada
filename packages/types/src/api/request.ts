export type RequestStatus = 'pending' | 'settling';

export interface Request {
  id: string;
  serviceTypeId: string;
  seekerUserId: string;
  addressId: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  serviceTypeId: string;
  serviceId?: string;
  description: string;
  latitude: number;
  longitude: number;
  addressLabel: string;
  imageUrls?: string[];
}

export interface RequestImage {
  id: string;
  requestId: string;
  image: string;
}
