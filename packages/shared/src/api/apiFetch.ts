import { API_URL } from '../env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthClient = any;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiFetch(
  authClient: AuthClient,
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
