import { authClient } from '@lib/authClient';
import { providerClient } from '@lib/providerClient';
import { useEffect, useState } from 'react';
import { useLoading } from '@repo/shared';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function useOptions() {
  const { setLoading } = useLoading();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { data: userSession } = authClient.useSession();

  const signOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  useEffect(() => {
    if (userSession) {
      providerClient
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
