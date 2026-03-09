import type { FeaturedService, Review, SearchResult, ServiceDetails, ServiceType } from '@repo/types';

import { apiFetch } from './apiFetch';

export async function getServiceTypes(
  authClient: { getCookie: () => string },
  baseUrl: string,
): Promise<ServiceType[]> {
  const response = await apiFetch(authClient, baseUrl, '/service-types', 'GET');
  if (!response.ok) throw new Error('Failed to fetch service types');
  return response.json();
}

export async function searchServices(
  authClient: { getCookie: () => string },
  baseUrl: string,
  query: string,
  serviceTypeId?: string,
): Promise<SearchResult[]> {
  const url = serviceTypeId
    ? `/services/search?query=${encodeURIComponent(query)}&serviceTypeId=${serviceTypeId}`
    : `/services/search?query=${encodeURIComponent(query)}`;
  const response = await apiFetch(authClient, baseUrl, url, 'GET');
  if (!response.ok) throw new Error('Failed to search services');
  return response.json();
}

export async function getFeaturedServices(
  authClient: { getCookie: () => string },
  baseUrl: string,
  limit = 10,
): Promise<FeaturedService[]> {
  const response = await apiFetch(authClient, baseUrl, `/services/featured?limit=${limit}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch featured services');
  return response.json();
}

export async function getServiceDetails(
  authClient: { getCookie: () => string },
  baseUrl: string,
  serviceId: string,
): Promise<ServiceDetails> {
  const response = await apiFetch(authClient, baseUrl, `/services/${serviceId}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch service details');
  return response.json();
}

export async function getServiceReviews(
  authClient: { getCookie: () => string },
  baseUrl: string,
  serviceId: string,
): Promise<Review[]> {
  const response = await apiFetch(authClient, baseUrl, `/services/${serviceId}/reviews`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}
