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

  // TODO: Update apiFetch to allow different content-types
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
