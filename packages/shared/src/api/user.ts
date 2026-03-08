import { apiFetch } from './apiFetch';

export async function getUserRole(authClient: { getCookie: () => string }): Promise<'seeker' | 'provider' | null> {
  try {
    const response = await apiFetch(authClient, '/users/profile', 'GET');
    if (!response.ok) return null;
    const profile = await response.json();
    return profile.role || null;
  } catch {
    return null;
  }
}
