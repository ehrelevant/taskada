// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getActiveUserId(authClient: any): Promise<string> {
  const { data: userSession, error } = await authClient.getSession();

  if (error || !userSession) {
    throw new Error(error?.message ?? 'No session found');
  }

  return userSession.user.id;
}
