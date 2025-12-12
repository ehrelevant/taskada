import * as SecureStore from 'expo-secure-store';

import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import { API_URL } from './env';

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'provider-app',
      storagePrefix: 'provider-app',
      storage: SecureStore,
    }),
    inferAdditionalFields({
      user: {
        phoneNumber: {
          type: 'string',
          required: true,
          input: true,
        },
        middleName: {
          type: 'string',
          required: false,
          input: true,
        },
        lastName: {
          type: 'string',
          required: true,
          input: true,
        },
      },
    }),
  ],
});

export async function getActiveUserId() {
  const { data: userSession, error } = await authClient.getSession();

  // TODO: Add proper null handling
  if (error || !userSession) {
    throw new Error(error?.message);
  }

  return userSession.user.id;
}