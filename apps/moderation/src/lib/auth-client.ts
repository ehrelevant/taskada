import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [
    inferAdditionalFields({
      user: {
        phoneNumber: { type: 'string', required: true, input: true },
        middleName: { type: 'string', required: false, input: true },
        lastName: { type: 'string', required: true, input: true },
      },
    }),
  ],
})

export const { signIn, signOut, useSession } = authClient
