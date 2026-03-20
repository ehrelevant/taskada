import { authClient } from '@lib/authClient';
import { seekerClient } from '@lib/seekerClient';
import { useEffect, useState } from 'react';
import { useLoading } from '@repo/shared';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function useOptionsScreen() {
  const { setLoading } = useLoading();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const signOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  const { data: userSession } = authClient.useSession();

  useEffect(() => {
    if (userSession) {
      seekerClient
        .apiFetch('/users/profile', 'GET')
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(console.error);
    }
  }, [userSession]);

  return {
    userSession,
    profile,
    signOut,
  };
}
