import { chatSocket, matchingSocket } from './index';

export async function connectChatSocket(
  authClient: { getCookie: () => string },
  userId: string,
  userRole: 'seeker' | 'provider',
) {
  const cookie = authClient.getCookie();
  return chatSocket.connect(cookie, userId, userRole);
}

export async function connectMatchingSocket(
  authClient: { getCookie: () => string },
  userId: string,
  userRole: 'seeker' | 'provider',
) {
  const cookie = authClient.getCookie();
  return matchingSocket.connect(cookie, userId, userRole);
}
