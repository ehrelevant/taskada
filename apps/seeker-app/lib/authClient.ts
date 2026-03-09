import { createAppAuthClient } from '@repo/shared';

import { API_URL } from './env';

export const authClient = createAppAuthClient({
  baseURL: API_URL,
  scheme: 'seeker-app',
  storagePrefix: 'seeker-app',
});
