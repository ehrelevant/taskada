import { API_URL } from "./env";
import { authClient } from "./authClient";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiFetch(endpoint: string, method: RequestMethod = 'GET', options?: Omit<RequestInit, 'method'>, authenticated = true) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  }

  if (authenticated) {
    // Add authentication cookie
    const cookies = authClient.getCookie();

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      method,
      headers: {
        ...headers,
        'Cookie': cookies,
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