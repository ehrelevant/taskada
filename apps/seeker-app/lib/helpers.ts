import { apiFetch as sharedApiFetch } from '@repo/shared';

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
