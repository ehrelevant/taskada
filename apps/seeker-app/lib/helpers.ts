import { API_URL, GOOGLE_MAPS_API_KEY } from './env';
import { authClient } from './authClient';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiFetch(
  endpoint: string,
  method: RequestMethod = 'GET',
  options?: Omit<RequestInit, 'method'>,
  authenticated = true,
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  if (authenticated) {
    // Add authentication cookie
    const cookies = authClient.getCookie();

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      method,
      headers: {
        ...headers,
        Cookie: cookies,
      },
      credentials: 'omit',
    });
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    method,
    headers,
  });
}

export interface ServiceType {
  id: string;
  name: string;
  iconUrl?: string | null;
}

export interface FeaturedService {
  serviceId: string;
  serviceName: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  initialCost: number;
  avgRating: number;
  reviewCount: number;
}

export interface SearchResult {
  serviceId: string;
  serviceName: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  initialCost: number;
  avgRating: number;
  reviewCount: number;
}

export interface ServiceDetails {
  id: string;
  initialCost: number;
  isEnabled: boolean;
  serviceTypeId: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  avgRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  rating: number | null;
  comment?: string | null;
  createdAt: string;
  reviewerName: string;
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  const response = await apiFetch('/service-types', 'GET');
  if (!response.ok) throw new Error('Failed to fetch service types');
  return response.json();
}

export async function searchServices(query: string, serviceTypeId?: string): Promise<SearchResult[]> {
  const url = serviceTypeId
    ? `/services/search?query=${encodeURIComponent(query)}&serviceTypeId=${serviceTypeId}`
    : `/services/search?query=${encodeURIComponent(query)}`;
  const response = await apiFetch(url, 'GET');
  if (!response.ok) throw new Error('Failed to search services');
  return response.json();
}

export async function getFeaturedServices(limit = 10): Promise<FeaturedService[]> {
  const response = await apiFetch(`/services/featured?limit=${limit}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch featured services');
  return response.json();
}

export async function getServiceDetails(serviceId: string): Promise<ServiceDetails> {
  const response = await apiFetch(`/services/${serviceId}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch service details');
  return response.json();
}

export async function getServiceReviews(serviceId: string): Promise<Review[]> {
  const response = await apiFetch(`/services/${serviceId}/reviews`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
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

export interface Request {
  id: string;
  serviceTypeId: string;
  seekerUserId: string;
  addressId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export async function createRequest(payload: CreateRequestPayload): Promise<Request> {
  const response = await apiFetch('/requests', 'POST', {
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create request');
  }
  return response.json();
}

export async function addRequestImages(requestId: string, imageUrls: string[]): Promise<void> {
  const response = await apiFetch(`/requests/${requestId}/images`, 'POST', {
    body: JSON.stringify({ imageUrls }),
  });
  if (!response.ok) {
    throw new Error('Failed to upload images');
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].formatted_address || '';
  }
  return '';
}

export async function forwardGeocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`,
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  return null;
}

export async function getUserRole(): Promise<'seeker' | 'provider' | null> {
  try {
    const response = await apiFetch('/users/profile', 'GET');
    if (!response.ok) return null;
    const profile = await response.json();
    return profile.role || null;
  } catch {
    return null;
  }
}
