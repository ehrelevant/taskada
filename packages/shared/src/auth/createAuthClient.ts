import * as SecureStore from 'expo-secure-store';

import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export interface AuthClientOptions {
  baseURL: string;
  scheme: string;
  storagePrefix: string;
}

export function createAppAuthClient(options: AuthClientOptions) {
  return createAuthClient({
    baseURL: options.baseURL,
    plugins: [
      expoClient({
        scheme: options.scheme,
        storagePrefix: options.storagePrefix,
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
}
