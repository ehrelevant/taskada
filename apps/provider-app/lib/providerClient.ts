import { ProviderClient } from '@repo/shared';

import { API_URL, GOOGLE_MAPS_API_KEY } from './env';
import { authClient } from './authClient';

export const providerClient = new ProviderClient({
  baseUrl: API_URL,
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  authClient,
});
