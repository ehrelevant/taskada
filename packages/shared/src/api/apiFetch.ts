// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthClient = any;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiFetch(
  authClient: AuthClient,
  baseUrl: string,
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

    return fetch(`${baseUrl}${endpoint}`, {
      ...options,
      method,
      headers: {
        ...headers,
        Cookie: cookies,
      },
      credentials: 'include',
    });
  }

  return fetch(`${baseUrl}${endpoint}`, {
    ...options,
    method,
    headers,
  });
}
