import { chatSocket, matchingSocket } from '@repo/shared';

import { authClient } from './authClient';

export async function connectChatSocket(userId: string, userRole: 'seeker' | 'provider') {
  const cookie = await authClient.getCookie();
  return chatSocket.connect(cookie, userId, userRole);
}

export async function connectMatchingSocket(userId: string, userRole: 'seeker' | 'provider') {
  const cookie = await authClient.getCookie();
  return matchingSocket.connect(cookie, userId, userRole);
}
