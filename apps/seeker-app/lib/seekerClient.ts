import { SeekerClient } from '@repo/shared';

import { API_URL, GOOGLE_MAPS_API_KEY } from './env';
import { authClient } from './authClient';

export const seekerClient = new SeekerClient({
  baseUrl: API_URL,
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  authClient,
});
