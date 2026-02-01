import { API_URL } from './env';
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

export async function searchServices(query: string): Promise<SearchResult[]> {
  const response = await apiFetch(`/services/search?query=${encodeURIComponent(query)}`, 'GET');
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
