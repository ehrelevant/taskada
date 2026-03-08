import { apiFetch as sharedApiFetch } from '@repo/shared';

import { API_URL } from './env';
import { authClient } from './authClient';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiFetch(
  endpoint: string,
  method: RequestMethod = 'GET',
  options?: Omit<RequestInit, 'method'>,
  authenticated = true,
) {
  return sharedApiFetch(authClient, endpoint, method, options, authenticated);
}

export async function uploadAvatar(uri: string): Promise<{ avatarUrl: string }> {
  const cookies = authClient.getCookie();

  const formData = new FormData();
  const filename = uri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri,
    name: filename,
    type,
  } as unknown as Blob);

  const response = await fetch(`${API_URL}/users/avatar`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload avatar');
  }

  return response.json();
}

export async function deleteAvatar(): Promise<void> {
  const response = await apiFetch('/users/avatar', 'DELETE');
  if (!response.ok) {
    throw new Error('Failed to delete avatar');
  }
}

export async function uploadMessageImages(bookingId: string, imageUris: string[]): Promise<string[]> {
  const cookies = authClient.getCookie();

  const formData = new FormData();

  for (const uri of imageUris) {
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('files', {
      uri,
      name: filename,
      type,
    } as unknown as Blob);
  }

  const response = await fetch(`${API_URL}/bookings/${bookingId}/messages/images`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to upload images');
  }

  const data = await response.json();
  return data.imageKeys;
}
