import { createAppAuthClient } from '@repo/shared';

export const authClient = createAppAuthClient({
  scheme: 'seeker-app',
  storagePrefix: 'seeker-app',
});

export async function getActiveUserId() {
  const { data: userSession, error } = await authClient.getSession();

  if (error || !userSession) {
    throw new Error(error?.message);
  }

  return userSession.user.id;
}
