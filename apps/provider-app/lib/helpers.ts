import { API_URL } from "./env";
import { authClient } from "./authClient";

export async function apiFetch(endpoint: string, options?: RequestInit, authenticated = true) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  }

  if (authenticated) {
    // Add authentication cookie
    const cookies = authClient.getCookie();
    console.log(cookies);

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        'Cookie': cookies,
      },
      credentials: 'omit',
    });
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}