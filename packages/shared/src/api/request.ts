import type { CreateRequestPayload, Request } from '@repo/types';

import { apiFetch } from './apiFetch';

export async function createRequest(
  authClient: { getCookie: () => string },
  baseUrl: string,
  payload: CreateRequestPayload,
): Promise<Request> {
  const response = await apiFetch(authClient, baseUrl, '/requests', 'POST', {
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create request');
  }
  return response.json();
}

export async function addRequestImages(
  authClient: { getCookie: () => string },
  baseUrl: string,
  requestId: string,
  imageUrls: string[],
): Promise<void> {
  const response = await apiFetch(authClient, baseUrl, `/requests/${requestId}/images`, 'POST', {
    body: JSON.stringify({ imageUrls }),
  });
  if (!response.ok) {
    throw new Error('Failed to upload images');
  }
}
