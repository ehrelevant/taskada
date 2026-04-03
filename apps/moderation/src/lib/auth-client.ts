import { API_URL } from '#/lib/env';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        phoneNumber: { type: 'string', required: true, input: true },
        middleName: { type: 'string', required: false, input: true },
        lastName: { type: 'string', required: true, input: true },
      },
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
